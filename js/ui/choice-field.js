// Shared markup for a compact selection with a short preview and expandable rule.
export function createChoiceField(id, caption, detailsCaption) {
    const root = document.createElement("div");
    root.className = "compact-field";
    const label = document.createElement("label");
    const title = document.createElement("span");
    title.textContent = caption;
    const select = document.createElement("select");
    select.id = id;
    const help = document.createElement("small");
    help.id = id + "-description";
    help.className = "field-help";
    help.setAttribute("aria-live", "polite");
    select.setAttribute("aria-describedby", help.id);
    label.append(title, select, help);
    const details = document.createElement("details");
    details.className = "rule-details";
    const summary = document.createElement("summary");
    summary.textContent = detailsCaption;
    const rule = document.createElement("p");
    rule.id = id + "-rule";
    details.append(summary, rule);
    root.append(label, details);
    return { root, select, help, rule, details };
}
