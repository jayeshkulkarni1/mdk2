export default function AddDamageCodeQueryOption(context) {
    let pageProxy = context.getPageProxy();
        let codevalue = pageProxy.getControl('FormCellContainer').getControl('AdditionalDamage');
        let codeGroup = context.getValue()[0].ReturnValue;
        if (codeGroup) {
            let specifier = codevalue.getTargetSpecifier();
            let filter = `$orderby=Code&$filter=CodeGroup eq '${codeGroup}'`;
            specifier.setQueryOptions(filter);
            codevalue.setTargetSpecifier(specifier);
        } else {
            let specifier = codevalue.getTargetSpecifier();
            let filter = '$orderby=Code';
            specifier.setQueryOptions(filter);
            codevalue.setTargetSpecifier(specifier);
        }
    }