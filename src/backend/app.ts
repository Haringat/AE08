import * as express from "express";
import {json} from "body-parser"
import {createServer} from "http";
import getConfig from "../config";
import "./model/index";
import User from "./model/User";
import Person from "./model/Person";
import EmailAddress from "./model/EmailAddress";
import Token, {tokenLifeTime} from "./model/Token";
import genHex from "../util/genHex";
import sha1 = require("sha1");
import {TableModel} from "../database/Table";
import Address from "./model/Address";
import Street from "./model/Street";
import City from "./model/City";
import Contact from "./model/Contact";
import Connection from "../database/adapters/postgres/index";

process.on("unhandledRejection", (e) => {
    console.log("caught unhandled rejection.");
    console.log(e);
    process.exit(-1);
});

(async () => {

    const config = await getConfig();

    TableModel.adapter = new Connection(config.db);

    await TableModel.getModelData();

    const app = express();

    app.use(json());

    app.post("/api/login", async (request, response) => {
        try {
            if (request.body.hasOwnProperty("email") && request.body.hasOwnProperty("password")) {
                const email: EmailAddress = EmailAddress.getDataSet<EmailAddress>([{
                    column: "email",
                    value: request.body["email"].toLowerCase()
                }]);
                const person: Person = Person.getDataSet<Person>([{
                    column: "uuid",
                    value: email.person
                }]);
                const user: User = User.getDataSet<User>([{
                    column: "person",
                    value: person.uuid
                }]);
                if (sha1(request.body["password"] + user.salt) === user.password) {
                    let currentToken: Token = Token.getDataSet<Token>([{
                        column: "user",
                        value: user.uuid
                    }]);
                    if (currentToken) {
                        currentToken.refresh();
                    } else {
                        currentToken = new Token({
                            token: genHex(128),
                            user: user.uuid,
                            expires: new Date(Date.now() + tokenLifeTime)
                        });
                    }
                    await TableModel.commit();
                    response.status(200).send({
                        success: true,
                        data: {
                            userId: user.uuid,
                            token: currentToken.token
                        }
                    }).end();
                } else {
                    throw new Error("wrong credentials");
                }
            } else {
                throw new Error("incomplete request");
            }
        } catch (e) {
            console.log(e);
            //noinspection UnnecessaryLocalVariableJS
            const error: Error = e;
            response.status(200).send({
                success: false,
                message: error.message
            }).end();
        }
    });

    app.post("/api/register", async (request, response) => {
        try {
            const city = City.getDataSet<City>([{
                column: "name",
                value: request.body["city"]
            }]) || new City({
                name: request.body["city"]
            });
            const street = Street.getDataSet<Street>([{
                column: "city",
                value: city.uuid
            }, {
                column: "name",
                value: request.body["street"]
            }]) || new Street({
                name: request.body["street"],
                city: city.uuid
            });
            const address = Address.getDataSet<Address>([{
                column: "street",
                value: street.uuid
            }, {
                column: "houseNumber",
                value: request.body["houseNumber"]
            }, {
                column: "addition",
                value: request.body["addition"]
            }]) || new Address({
                street: street.uuid,
                addition: request.body["addition"],
                houseNumber: request.body["houseNumber"]
            });
            const person = new Person({
                address: address.uuid,
                forename: request.body["forename"],
                surname: request.body["surname"]
            });
            const email = new EmailAddress({
                person: person.uuid,
                email: request.body["email"].toLowerCase()
            });
            const salt = genHex(2048);
            new User({
                password: sha1(request.body["password"] + salt).toString(),
                salt: salt,
                person: person.uuid
            });
            await TableModel.commit();
            response.status(200).send({
                success: true
            });
        } catch (e) {
            console.log(e);
            const error: Error = e;
            response.status(200).send({
                success: false,
                message: error.message
            }).end();
        }
    });

    app.get("/api/users/:userId/contacts", async (request, response) => {
        try {
            const token = Token.getDataSet<Token>([{
                column: "token",
                value: request.query["token"]
            }, {
                column: "user",
                value: request.params["userId"]
            }]);
            if (!token) {
                throw new Error("not logged in");
            }
            token.refresh();
            const user = User.getDataSet<User>([{
                column: "user",
                value: token.user
            }]);
            const contacts = Contact.where([{
                column: "user",
                value: user.uuid
            }]);
            response.status(200).send({
                success: true,
                data: contacts
            });
        } catch (e) {
            console.log(e);
            const error: Error = e;
            response.status(200).send({
                success: false,
                message: error.message
            }).end();
        }
    });

    const server = createServer(app);
    server.listen(config.api.port, config.api.host, () => {
        console.log(`server listening on [${config.api.host}]:${config.api.port}`);
    });

})();
