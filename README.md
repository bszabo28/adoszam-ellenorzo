# Telepítés:
```
npm install adoszam-ellenorzo
```

# Használat:

```javascript
import { Validator } from "adoszam-ellenorzo/lib/validator";
import { Generator } from "adoszam-ellenorzo/lib/generator";
import { IValidatorError, IValidatorInfo} from "adoszam-ellenorzo/lib/nav";

var validator:Validator = new Validator();
var result:(IValidatorError|IValidatorInfo) = validator.check("24225221-2-43");

// Véletlen adószámot ad vissza
result = Generator.get(); 

// Véletlen számokkal kiegészíti az adószámot, csak akkor lesz érvénytelen, 
// ha a paraméternek megadott szám már eleve érvénytelenné teszi
result = Generator.get('242252');   


// Eredmény hibátlan adószám esetében:
/*{ 
    valid: true,
    main: '24225221',
    cvs: '1',
    vat: '2',
    region: '43',
    formatted: '24225221-2-43',
    vatName: 'Adómentes tevékenységet végző adóalany (ÁFA törvény 85-86. §-ai szerinti tevékenységek)',
    regionName: 'Dél-Budapest' 
}*/
```
