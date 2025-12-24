export default function partQueryOption(context) {
    let pageProxy = context.getPageProxy();
        let partvalue = pageProxy.getControl('FormCellContainer').getControl('PartDetailsLstPkr');
        let PartGroup = "";
        if(context.getValue()[0]) {
            PartGroup = context.getValue()[0].ReturnValue;
        } 
        if (PartGroup) {
            let specifier = partvalue.getTargetSpecifier();
            let filter = `$orderby=Code&$filter=CodeGroup eq '${PartGroup}' and Catalog eq 'B'`;
            specifier.setQueryOptions(filter);
            partvalue.setTargetSpecifier(specifier);
        } else {
            let specifier = partvalue.getTargetSpecifier();
            let filter = '$orderby=Code';
            specifier.setQueryOptions(filter);
            partvalue.setTargetSpecifier(specifier);
        }
    }