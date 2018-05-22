export class ToastConfig {
    constructor(
    public message: string = "", 
    public duration: number = 3000, 
    public position: string = "bottom",
    public classes: string[] = [], 
    public hasCloseButtom: boolean = false){}
}