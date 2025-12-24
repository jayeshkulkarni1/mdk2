export default function codeQueryOption(context) {
    //context.showActivityIndicator('');
    let pageProxy = context.getPageProxy();
        
        let codevalue = pageProxy.getControl('FormCellContainer').getControl('DamageDetailsLstPkr');
        let codeGroup = "";
        if(context.getValue()[0]) {
            codeGroup = context.getValue()[0].ReturnValue;
        } 
      
       
        if (codeGroup) {
            let specifier = codevalue.getTargetSpecifier();
            let filter = `$orderby=Code&$filter=CodeGroup eq '${codeGroup}' and Catalog eq 'D'`;
            specifier.setQueryOptions(filter);
            codevalue.setTargetSpecifier(specifier);
        } else {
            let specifier = codevalue.getTargetSpecifier();
            let filter = '$orderby=Code';
            specifier.setQueryOptions(filter);
            codevalue.setTargetSpecifier(specifier);
        }
    
    }