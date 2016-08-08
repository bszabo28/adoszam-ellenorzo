/// <reference path="../typings/tsd.d.ts" />
"use strict";
// HIBÁK
// WINDOWS ALATT NEM IGAZÁN MŰKÖDIK A test/*.test.ts -> nem találja!
var validator_1 = require("../src/validator");
var generator_1 = require("../src/generator");
describe('Adószám ellenörző teszt', function () {
    var subject;
    var generator;
    beforeEach(function () {
        subject = new validator_1.Validator();
        generator = new generator_1.Generator(subject);
    });
    describe('#Adószámok tesztelése', function () {
        it('Megfelelő adószámok', function () {
            var c = 1000;
            while (c-- > 0) {
                var result = generator.get();
            }
        });
    });
    describe('#Hibák tesztelése', function () {
        it('Túl rövid, vagy hosszú adószám', function () {
            var result = subject.check("23");
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if (result['errors'][0] !== 'Pontosan 8 vagy 11 számjegyből állhat') {
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });
        it('Formailag nem megfelelő adószámok', function () {
            var result = subject.check("2422522a243");
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if (result['errors'][1] !== 'Adószám nem kezdődhet nullával, és számjegyekből kell állnia') {
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });
        it('Ellenörzőszám hiba', function () {
            var result = subject.check("24225222-2-43");
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if (result['errors'][0] !== 'Nem érvényes az ellenörző szám') {
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });
        it('Áfakör hiba', function () {
            var result = subject.check("24225221-9-43");
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if (result['errors'][0] !== 'Nincs ilyen kódszámmal áfakör') {
                throw new Error('nem megfelelő hibaüzenet');
            }
        });
        it('Adóhatóság hiba', function () {
            var result = subject.check("24225221-2-99");
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if (result['errors'][0] !== 'Nincs ilyen kódszámmal adóhatóság') {
                throw new Error('nem megfelelő hibaüzenet');
            }
        });
    });
});
