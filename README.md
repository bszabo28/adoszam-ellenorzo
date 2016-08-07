# Telepítés:
npm install adoszam-ellenorzo

# Használat:

```javascript
import {Validator} from "adoszam-ellenorzo/lib/validator";

var taxnumber = new Validator();
taxnumber.check("24225221-2-43");

// Válasz
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
