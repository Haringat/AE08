drop table if exists "countries" cascade;
drop table if exists "cities" cascade;
drop table if exists "users" cascade;
drop table if exists "streets" cascade;
drop table if exists "addresses" cascade;
drop table if exists "persons" cascade;

create table "countries" (
    "uuid"  uuid    not null primary key,
    "code"  varchar not null
);

create table "cities" (
    "uuid"      uuid    not null primary key,
    "name"      varchar not null
);

create table "citiesPostalCodesCountries" (
    "uuid"          uuid    not null primary key,
    "country"       uuid    not null,
    "postalCode"    uuid    not null,
    "place"         uuid    not null
);

create table "postalCodes" (
    "uuid"          uuid        not null primary key,
    "postalCode"    varchar(10) not null,
    "city"          uuid        not null
);

create table "users" (
    "uuid"      uuid    not null primary key,
    "password"  varchar not null,
    "salt"      varchar not null
);

create table "streets" (
    "uuid"  uuid    not null primary key,
    "city"  uuid    not null,
    "name"  varchar not null
);

create table "addresses" (
    "uuid"          uuid    not null primary key,
    "street"        uuid    not null,
    "houseNumber"   int     not null
);

create table "emailAddresses" (
    "uuid"
)

create table "persons" (
    "uuid"      uuid    not null primary key,
    "forename"  varchar not null,
    "surname"   varchar not null,
    "address"   uuid    not null
);

create table "contacts" (
    "uuid"      uuid    not null primary key,
    "user"      uuid    not null,
    "contact"   uuid    not null
);

alter table "cities"    add foreign key "citiesAreInCountries"      ("country")     references "countries"      ("uuid");
alter table "cities"    add foreign key "citiesArePlaces"           ("place")       references "places"         ("uuid");
alter table "cities"    add foreign key "citiesHavePostalCodes"     ("postalCode")  references "postalCodes"    ("uuid");
alter table "streets"   add foreign key "streetsAreInCities"        ("city")        references "city"           ("uuid");
alter table "addresses" add foreign key "addressesAreInStreets"     ("street")      references "streets"        ("uuid");
alter table "persons"   add foreign key "personsLiveAtAddresses"    ("address")     references "addresses"      ("uuid");
alter table "users"     add foreign key "usersArePersons"           ("uuid")        references "addresses"      ("uuid");