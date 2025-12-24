export default function DepartmentVisibility(context) {
	
    if(context.binding.NotificationType === "M4"){
        return true;
    }
    return false;
}
