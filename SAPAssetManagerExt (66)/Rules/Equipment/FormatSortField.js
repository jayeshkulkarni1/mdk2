export default function FormatSortField(context) {
   return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${context.binding.EquipId}'`, '').then(result => {
    if (result && result.length > 0) {
        return result.getItem(0).ZSortField;
    }
})
}
