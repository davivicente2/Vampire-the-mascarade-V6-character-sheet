export function bindInput(id, getter, setter, options = {}) {
    const element = document.getElementById(id);
    element.value = getter();

    const eventName = element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => {
        const value = options.number ? Number(element.value || 0) : element.value;
        setter(value);
        if (options.after) options.after();
        options.save?.();
    });
}

export function createDots(value, max, onChange, label, className = "dot") {
    const wrapper = document.createElement("div");
    wrapper.className = "dots";
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", label);

    for (let index = 1; index <= max; index += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className + (index <= value ? " filled" : "");
        button.setAttribute("aria-label", label + ": " + index);
        button.addEventListener("click", () => onChange(index === value ? index - 1 : index));
        wrapper.appendChild(button);
    }

    return wrapper;
}

export function populateSelect(select, options, selectedValue, placeholder = "—") {
    select.replaceChildren();

    if (placeholder !== null) {
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = placeholder;
        select.appendChild(empty);
    }

    options.forEach(({value, label}) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    });

    select.value = selectedValue || "";
}
