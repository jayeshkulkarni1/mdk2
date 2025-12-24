import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function codeQueryOption(context) {
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        var sCodeGroup = "";
        if(context.binding.Items && context.binding.Items !== "")
        {
          //  sCode = context.binding.Items[0].DamageCode;
            sCodeGroup = context.binding.Items[0].CodeGroup;
        }
         
            let filter = `\$filter=CodeGroup eq '${sCodeGroup}' and Catalog eq 'C'&\$orderby=Code`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], filter).then(result => {
                var json = [];
                result.forEach(function(element) {
                    json.push({
                        'DisplayValue': `${element.Code} - ${element.CodeDescription}`,
                        'ReturnValue': element.Code,
                    });
                });
                const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                return finalResult;
            });
    } else {
        let oCodeGroup  = pageProxy.getControl('FormCellContainer').getControl('DamageGroupLstPkr');
        let sCodeGroup = oCodeGroup.getValue()[0].ReturnValue;
        if(sCodeGroup !== "") {
            let filter = `\$filter=CodeGroup eq '${sCodeGroup}' and Catalog eq 'C'&\$orderby=Code`;
       
        }
        else 
        {
            let filter = `\$filter=Catalog eq 'C'&\$orderby=Code`;
       
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], filter).then(result => {
            var json = [];
            result.forEach(function(element) {
                json.push({
                    'DisplayValue': `${element.Code} - ${element.CodeDescription}`,
                    'ReturnValue': element.Code,
                });
            });
            const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
            let finalResult = [...uniqueSet].map(item => JSON.parse(item));
            return finalResult;
        });
    }
   
}