drop table if exists "countries"                    cascade;
drop table if exists "cities"                       cascade;
drop table if exists "citiesPostalCodesCountries"   cascade;
drop table if exists "postalCodes"                  cascade;
drop table if exists "users"                        cascade;
drop table if exists "streets"                      cascade;
drop table if exists "addresses"                    cascade;
drop table if exists "emailAddresses"               cascade;
drop table if exists "phoneAreaCodes"               cascade;
drop table if exists "phoneNumbers"                 cascade;
drop table if exists "persons"                      cascade;
drop table if exists "contacts"                     cascade;

create table "countries" (
    "uuid"      uuid    not null primary key,
    "code"      varchar not null,
    "phoneCode" int     not null
);

create table "cities" (
    "uuid"  uuid    not null primary key,
    "name"  varchar not null
);

create table "citiesPostalCodesCountries" (
    "uuid"          uuid    not null primary key,
    "country"       uuid    not null,
    "postalCode"    uuid    not null,
    "city"          uuid    not null
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
    "uuid"      uuid    not null primary key,
    "email"     varchar not null,
    "person"    uuid    not null
);

create table "phoneAreaCodes" (
    "uuid"      uuid    not null primary key,
    "country"   uuid    not null,
    "areaCode"  varchar not null
);

create table "phoneNumbers" (
    "uuid"      uuid    not null primary key,
    "areaCode"  uuid    not null,
    "number"    varchar not null,
    "person"    uuid    not null
);

create table "persons" (
    "uuid"      uuid    not null primary key,
    "forename"  varchar not null,
    "surname"   varchar not null,
    "address"   uuid    not null
);

create table "contacts" (
    "uuid"          uuid    not null primary key,
    "user"          uuid    not null,
    "contactPerson" uuid    not null
);

alter table "citiesPostalCodesCountries"    add constraint  "citiesAreInCountries"          foreign key ("country")         references  "countries"         ("uuid");
alter table "citiesPostalCodesCountries"    add constraint  "citiesArePlaces"               foreign key ("city")            references  "cities"            ("uuid");
alter table "citiesPostalCodesCountries"    add constraint  "citiesHavePostalCodes"         foreign key ("postalCode")      references  "postalCodes"       ("uuid");
alter table "streets"                       add constraint  "streetsAreInCities"            foreign key ("city")            references  "cities"            ("uuid");
alter table "addresses"                     add constraint  "addressesAreInStreets"         foreign key ("street")          references  "streets"           ("uuid");
alter table "persons"                       add constraint  "personsLiveAtAddresses"        foreign key ("address")         references  "addresses"         ("uuid");
alter table "users"                         add constraint  "usersArePersons"               foreign key ("uuid")            references  "addresses"         ("uuid");
alter table "phoneNumbers"                  add constraint  "personsHavePhoneNumbers"       foreign key ("person")          references  "persons"           ("uuid");
alter table "phoneNumbers"                  add constraint  "phoneNumbersHaveAreaCodes"     foreign key ("areaCode")        references  "phoneAreaCodes"    ("uuid");
alter table "phoneAreaCodes"                add constraint  "areaCodesBelongToCountries"    foreign key ("country")         references  "countries"         ("uuid");
alter table "contacts"                      add constraint  "usersHaveContacts"             foreign key ("user")            references  "users"             ("uuid");
alter table "contacts"                      add constraint  "contactsToPersons"             foreign key ("contactPerson")   references  "persons"           ("uuid");
alter table "emailAddresses"                add constraint  "personsHaveEmailAddresses"     foreign key ("person")          references  "persons"           ("uuid");