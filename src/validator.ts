
import {IValidatorError} from "./index";
import {IValidatorInfo} from "./index";


export class Validator{

    // Sorrendnek fontos szerepe van  
    protected _messages = [
        {msg: 'Pontosan 8 vagy 11 számjegyből állhat'},
        {msg: 'Adószám nem kezdődhet nullával, és számjegyekből kell állnia'},
        {msg: 'Nem érvényes az ellenörző szám'},
        {msg: 'Nincs ilyen kódszámmal áfakör'},
        {msg: 'Nincs ilyen kódszámmal adóhatóság'}
    ];
    
    protected _vatCodes = {
        1: 'Alanyi adómentes adóalany',
        2: 'Adómentes tevékenységet végző adóalany (ÁFA törvény 85-86. §-ai szerinti tevékenységek)',
        3: 'Az egyszerűsített vállalkozói adózás alá tartozó (EVA) adóalany',
        4: 'Csoportos adóalanyiságot választó adóalany',
        5: 'Csoportos adóalanyiságot választó adóalany'
    };
    
    protected _taxRegions = {
        2: 'Baranya megye',
        3: 'Bács-Kiskun megye',
        4: 'Békés megye',
        5: 'Borsod-Abaúj-Zemplén megye',
        6: 'Csongrád megye',
        7: 'Fejér megye',
        8: 'Győr-Moson-Sopron megye',
        9: 'Hajdú-Bihar megye',
        10:'Heves megye',
        11:'Komárom-Esztergom megye',
        12:'Nógrád megye',
        13:'Pest megye',
        14:'Somogy megye',
        15:'Szabolcs-Szatmár-Bereg megye',
        16:'Jász-Nagykun-Szolnok megye',
        17:'Tolna megye',
        18:'Vas megye',
        19:'Veszprém megye',
        20:'Zala megye',
        41:'Észak-Budapest',
        42:'Kelet-Budapest',
        43:'Dél-Budapest',
        44:'Kiemelt Adózók Adóigazgatósága',
        51:'Kiemelt Ügyek Adóigazgatósága'
    };
    
    protected _taxRegionCodes:string[];
    
    // Ellenörző számok, a 8., ellenörző szám kiszámolásához
    protected _validators:number[] = [9,7,3];
    
    // Törzsszám 8, a teljes adószám 11 számjegy hosszú
    protected _validLength:number[] = [8,11];
    
    // Csak számok kerülhetnek be az input mezőbe
    protected _notNeeded:RegExp = /[^0-9]+/;
    
    // Formailag érvényes adószám felépítése
    // 0-val valószínű nem kezdődhet adószám
    protected _validTaxnumber:RegExp = /(([1-9]{1}\d{6})(\d))((\d)(\d\d))*/;
    
    /*** 
    | ------------------------------------------
    | Illetékességi terület kódjainak kigyűjtése
    | ------------------------------------------
    | Egy illetékességi területhez több kód is
    | tartozhat, mivel 0-val is kezdődhet,
    | így ezek szöveg típusúak lesznek
    | 
    */
    protected _generateTaxRegionCodes():void{

        if(this._taxRegionCodes){
            return;
        }

        var toReturn = [];
        
        for(let i=2,j=20;i<=j;++i){
            let temp = i.toString().length < 2 ? '0' + i.toString() : i.toString();
            toReturn.push(temp,(i+20).toString());    
        }
        
        for(let i=41,j=44;i<=j;++i){
            toReturn.push(i.toString());
        }
        
        toReturn.push((51).toString());
        
        this._taxRegionCodes = toReturn;
    }  

    /*** 
    | ------------------------------------------
    | Illetékességi terület kódjai
    | ------------------------------------------
    | 
    | @return array
    */    
    public getRegionCodes():Array<string>{
        return this._taxRegionCodes;
    }  
    
    /*** 
    | --------------------------------------
    | Adózási régió -e a beírt szám
    | --------------------------------------
    | Adózási régióknak 21 alatt két számjegyük 
    | 40 felett egy számjegyük van
    |
    */    
    protected _isTaxRegion(val:string):boolean{
        return this._taxRegionCodes.indexOf(val) !== -1;
    }        

    /*** 
    | --------------------------------------
    | Az adószám érvényesítése 
    | --------------------------------------
    | - Kizárólag csak számok alkothatják
    | - Minimum 8 számjegy hosszú lehet
    | - Maximum 12 számjegyből állhat
    | - 8. szám is legyen érvényes
    | - ? nem kezdődhet 0-val ? 
    |
    */
    protected _validate(taxnum:string):boolean[]{  

        // Üzenetek e tömb alapján lesznek legyűjtve, emiatt fontos 
        // a _messeges sorrendje       
        var tempErrors:boolean[] = Array(6);
        
        // --------- ADÓSZÁM FORMAI ELLENŐRZÉSE-----------------
        // Adószám csak "szám" lehet
        tempErrors[1] = !!taxnum && this._notNeeded.test(taxnum);
        
        // az első 8 szám a törzsszám
        // 11 számjegyből álló verzió a teljes adószám
        if(!tempErrors[1] && 
        this._validLength.indexOf(taxnum.length) !== -1)
        {
            tempErrors[0] = !this._validTaxnumber.test(taxnum);
        }
        else{
            tempErrors[0] = true;
        }

        // Ha nem megfelelő az adószám, ne ellenőrizze a tartalmát
        if(tempErrors[0]){
            return tempErrors;
        }

        // --------- ADÓSZÁM TARTALMI ELLENŐRZÉSE-----------------
        // ["12345678910", "12345678", "1234567", "8", "110", "1", "10"]
        var parts = this._validTaxnumber.exec(taxnum);
        var temp = parts[0].toString().split('');
            
        // Ellenörzőszám megfelelő-e
        tempErrors[2] = +parts[3] !== this.cvs(temp);
        
        // Első nyolc számjegy van csak, akkor álljon le
        if(typeof parts[5] === 'undefined'){ 
            return tempErrors;
        }
        
        // Áfakód ellenőrzése
        tempErrors[3] = !this._vatCodes[+parts[5]];
        
        // Területileg illetékes adóhatóság száma-e
        tempErrors[4] = !this._isTaxRegion(parts[6]);
        
        return tempErrors;
    }
    
    /*           
    | --------------------------------------
    | Az adószám formázása 
    | --------------------------------------
    | - első nyolc számjegy az úgynevezett törzsszám
    | - kilencedik számjegy az áfakör
    | - az utolsó két számjegy az illetékes adóhatóság
    |
    | Példa formázás:
    | xxxxxxxx-x-xx
    |
    */
    protected _getInfo(taxnumber:string):IValidatorInfo{
        
        var parts = this._validTaxnumber.exec(taxnumber);
        
        var toReturn:IValidatorInfo = {
            valid: true,
            main: parts[2] + parts[3],
            cvs: parts[3],
            vat: parts[5],
            region: parts[6]            
        };
                
        if(parts[5]){
        // Teljes adószám formázható
        toReturn['formatted'] = toReturn.main + '-' + toReturn.vat + '-' + toReturn.region;

        // Áfakör kikeresése
        toReturn['vatName'] = this._vatCodes[+toReturn.vat];
        
        // Régiókód alapján kikeresem a régiónevet 
        let r = +toReturn.region > 20 && +toReturn.region <= 40 ?
                +toReturn.region - 20 :
                +toReturn.region;

        toReturn['regionName'] = this._taxRegions[r];
        }
        
        return toReturn;
    }    
    
    /*           
    | --------------------------------------
    | Validálás után kapott tömb szöveg tömbbé alakítása
    | --------------------------------------
    |
    */
    protected _getError(b:boolean[]):IValidatorError{
        
        var toReturn = {valid: false,errors:[]};
        
        for(let n=0;n<b.length;n++){

            // Hibaüzenet lekérdezése
            let item = this._messages[n];
            if(b[n]){
                toReturn['errors'].push(item.msg);
            }
        }
        
        return toReturn;
    }    

    /*** 
    | --------------------------------------
    | CVS ellenőrző
    | --------------------------------------
    | Nyolcadik számjegy az adószámban 
    | ellenörző funkciót lát el.
    |
    | @return number
    */
    public cvs(taxnum:string[]):number{
        // Csak egyser fut le
        this._generateTaxRegionCodes();

        var cvs:number = 0;
        
        for(let n=0;n<this._validators.length;++n){
            let i = this._validators[n];
            let a = +taxnum[n];
            let b = +taxnum[n+4];
            cvs += i * (a + b);
        }
        
        cvs += (+taxnum[3]);
        cvs = cvs % 10;
    
        if(cvs > 0){
            cvs = 10 - cvs;
        } 
        
        return cvs; 
    }

    /*           
    | --------------------------------------
    | Adószám ellenőrzése
    | --------------------------------------
    |
    */    
    public check(taxnumber:string):(IValidatorInfo|IValidatorError|boolean){

        if(!taxnumber){
            return false;
        }

        // Adószám az ténylegesen lehet szám is (sic)
        // Adószáámot kötőjelekkel is meg lehet adni
        taxnumber = taxnumber.toString().replace(/-/g,'');   

        var errors = this._validate(taxnumber);
        var isValid = errors.indexOf(true) === -1;
        var toReturn;
        
        if(isValid){
            toReturn =  this._getInfo(taxnumber);;
        }
        else{
            toReturn = this._getError(errors);
        }
        
        return toReturn;
    }


    public constructor(){
        this._generateTaxRegionCodes();
    }
}