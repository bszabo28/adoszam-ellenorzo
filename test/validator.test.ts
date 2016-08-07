/// <reference path="../typings/tsd.d.ts" />

import { Validator } from "../src/validator";
import { IValidatorError, IValidatorInfo} from "../src/nav";


describe('Adószám ellenörző teszt', () => {
    var subject : Validator;

    beforeEach(function () {
        subject = new Validator();
    });

    describe('#Hibák tesztelése', () => {

        it('Túl rövid, vagy hosszú adószám', () => {
            var result = subject.check("23");

            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if(
                result['errors'][0] !== 'Pontosan 8 vagy 11 számjegyből állhat'
            ){
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });

        it('Formailag nem megfelelő adószámok', () => {
            var result = subject.check("2422522a243");
            
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if(
                result['errors'][1] !== 'Adószám nem kezdődhet nullával, és számjegyekből kell állnia'
            ){
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });

        it('Ellenörzőszám hiba', () => {
            var result = subject.check("24225222-2-43");
            
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if(
                result['errors'][0] !== 'Nem érvényes az ellenörző szám'
            ){
                console.log(result);
                throw new Error('nem megfelelő hibaüzenet');
            }
        });

        it('Áfakör hiba', () => {
            var result = subject.check("24225221-9-43");
            
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if(
                result['errors'][0] !== 'Nincs ilyen kódszámmal áfakör'
            ){
                throw new Error('nem megfelelő hibaüzenet');
            }
        });

        it('Adóhatóság hiba', () => {
            var result = subject.check("24225221-2-99");
            
            if (!result || result['valid'] === true) {
                throw new Error('Hibás adószámnak kellene lennie');
            }
            else if(
                result['errors'][0] !== 'Nincs ilyen kódszámmal adóhatóság'
            ){
                throw new Error('nem megfelelő hibaüzenet');
            }
        });   
    });    
});