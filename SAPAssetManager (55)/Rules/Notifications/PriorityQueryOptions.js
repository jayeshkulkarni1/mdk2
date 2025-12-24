export default function PriorityQueryOptions(context) {
    //alert(JSON.stringify(context.binding));
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return "$filter=PriorityType eq 'PM'&$orderby=Priority";
    }
    return "$filter=PriorityType eq '{{#Property:PriorityType}}'&$orderby=Priority";
}
