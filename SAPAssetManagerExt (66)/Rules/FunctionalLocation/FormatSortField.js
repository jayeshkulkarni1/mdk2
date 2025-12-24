export default function FormatSortField(context) {
    //alert(JSON.stringify(context.binding));
    return context.binding.ZSortField !== '' ? context.binding.ZSortField : '-';
}
