INSERT INTO "cities" (uuid, name) VALUES (
    '05ed0e52-68c5-4bb5-a89b-96dd6cc124c2', 'Hamburg'
), (
    '91fe9ef8-9806-42b6-ac2e-91555eeaa748', 'German mobile net provider'
);
INSERT INTO "streets" (uuid, city, name) VALUES (
    'a6e357fb-fbee-4eb3-9f7b-032e43e6ed27', '05ed0e52-68c5-4bb5-a89b-96dd6cc124c2', 'Burgwedel'
);
INSERT INTO "postalCodes" (uuid, "postalCode") VALUES (
    '46047bf4-8d10-4eb5-bdd0-3fc987db4e9c', '22457'
);
INSERT INTO "countries" (uuid, code, "phoneCode") VALUES (
    '93d9753a-0760-4e00-bd61-6c8419379921', 'DE', 49
);
INSERT INTO "citiesPostalCodesCountries" (uuid, country, "postalCode", city) VALUES (
    '3951bc39-3843-4480-8662-800fc23567e0', '93d9753a-0760-4e00-bd61-6c8419379921', '46047bf4-8d10-4eb5-bdd0-3fc987db4e9c', '05ed0e52-68c5-4bb5-a89b-96dd6cc124c2'
);
INSERT INTO "addresses" (uuid, street, "houseNumber", addition) VALUES (
    '9d9d91d7-f3e2-4072-a171-efe5b48b21e5', 'a6e357fb-fbee-4eb3-9f7b-032e43e6ed27', 43, 'a'
);
INSERT INTO "persons" (uuid, forename, surname, address) VALUES (
    'a0dd58d9-06e3-4939-8b3e-e15702c8a7ff', 'Marcel', 'Mundl', '9d9d91d7-f3e2-4072-a171-efe5b48b21e5'
);
INSERT INTO "emailAddresses" (uuid, email, person) VALUES (
    '390bf9fa-c8a1-4fdf-9ba1-b02db5530cf9', 'Marcel@Mundlhome.de', 'a0dd58d9-06e3-4939-8b3e-e15702c8a7ff'
);
INSERT INTO "users" (uuid, person, password, salt) VALUES (
    '31b572ac-4df6-43bd-834e-fea150d66f7a', 'a0dd58d9-06e3-4939-8b3e-e15702c8a7ff', '851d4ac925c2650dc460d206c0aef14e2d7d4a0c', 'a0e70aa2a0ffff5f8b28b186b7fa67d1886530d6c7232e0f7c61bad780e0bb0f836f7425a1b7575b78d44e708b9f247befe47e58615dcaee005e3bbb8e67e458'
);
INSERT INTO "phoneAreaCodes" (uuid, "city", "areaCode") VALUES (
    '6d62c4d6-740e-4a8a-b8a4-161c4b48b93e', '91fe9ef8-9806-42b6-ac2e-91555eeaa748', '152'
);
INSERT INTO "phoneNumbers" (uuid, "areaCode", number, person) VALUES (
    'ebadd025-78ea-4bd5-bc7c-86434cc5e114', '6d62c4d6-740e-4a8a-b8a4-161c4b48b93e', '04839722', 'a0dd58d9-06e3-4939-8b3e-e15702c8a7ff'
);