
import { IValidatorError, 
         IValidatorInfo, 
         Validator } from "./index";

export class Generator{
    
    protected _random(min,max):number{
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    public get(taxnumber?:string):(IValidatorError|IValidatorInfo|boolean){
        
        // Kapott-e paramétert a függvény?
        var txn = typeof taxnumber !== 'undefined' ? taxnumber : '';
        var taxnum:string[] = txn ? txn.split('') : [];
        var orig:string[] = taxnum.slice(0);
        var trc = this.validator.getRegionCodes();  
        
        for(let i=orig.length,j=7;i<j;++i){
            // Az első szám nem lehet nulla
            taxnum.push(this._random(i === 0 ? 1 : 0,9).toString());
        }
        
        // Ha nincs ellenörző szám beállítva
        if(orig.length < 8){
            taxnum.push(this.validator.cvs(taxnum).toString());
        }
        
        // Ha nincs adókör beállítva
        if(orig.length < 9){
            taxnum.push(this._random(1,5).toString());
        }
        
        // Ha nincs adózási illetékességi terület beállítva                 
        if(orig.length < 10){
            let trCode = trc[this._random(0,trc.length)];
            
            if(trCode){
                taxnum = taxnum.concat(trCode); 
            }
        }
        
        // Ha csak az első szám van beállítva
        else if(orig.length < 11){
            let fl = taxnum[9];
            let filtered = trc.filter(v => {
                return v[0] === fl;
            });
            
            let trCode = filtered[this._random(0,filtered.length)];
            
            if(trCode){
                trCode.split('');
                taxnum.push(trCode[1]);                
            }
        }
        return this.validator.check(taxnum.join(''));
                    
    }
    
    constructor(protected validator:Validator){}
}
