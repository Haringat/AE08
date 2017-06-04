import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";

export interface IValue {
    /**
     * internal value
     */
    modelValue: string;
    /**
     * string representation of the value
     */
    displayValue: string;
    /**
     * whether or not the value is selected. Defaults to false if omitted.
     * For Select Fields: Only one value be preselected.
     */
    selected?: boolean;
}

@Component({
    selector: "x-ffs-select",
    templateUrl: "src/formFields/components/select/select.view.html",
    inputs: ["model", "placeholder"],
    outputs: ["change"]
})
export default class SelectComponent implements OnInit, OnChanges {

    public expanded: boolean;

    private _selectedValue: IValue;

    public set selectedValue(newSelectedValue: string) {
        this._selectedValue = this.getFullValue(newSelectedValue);
        this.change.emit(this._selectedValue);
    }

    public get selectedValue() {
        return this._selectedValue.modelValue;
    }

    public getFullValue(modelValue: string) {
        return this.model.find((value) => value.modelValue === modelValue);
    }

    @Input("model")
    public model: Array<IValue>;

    @Output("change")
    public change: EventEmitter<IValue> = new EventEmitter(false);


    public constructor() {
    }

    public ngOnInit() {
        this.model = this.model || [];
        this.expanded = false;
    }

    public ngOnChanges(changes: SimpleChanges) {
        let selectedValues = Object.getOwnPropertyNames(changes)
            .map((prop) => changes[prop])
            .map((change) => change.currentValue)
            .filter((value: IValue) => value.selected);
        if (selectedValues.length > 1) {
            throw new Error("FormFields->Select only supports one selected value");
        }
        if (selectedValues.length === 0) {
            this._selectedValue = this.model[0];
        } else {
            this._selectedValue = selectedValues[0];
        }
    }

    toggleExpanded() {
        this.expanded = !this.expanded;
        console.log(`toggle expanded. Now ${this.expanded}`);
    }

}