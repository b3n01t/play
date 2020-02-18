
type Tool = {
    label: string,
    id: string,
    onSelect: (id: string, label: string) => void
}

export const createToolBar = (tools: Tool[], selected: string, className?: string) => {
    const wrapper = document.createElement('div');
    const classes = ['tool-bar'];
    if (className) {
        classes.push(className);
    }
    wrapper.setAttribute('class', classes.join(' '));
    const toolEls = tools.map((tool) => {
        const toolEl = document.createElement('div');
        toolEl.innerText = tool.label;
        if (tool.id === selected) {
            toolEl.setAttribute('class', 'tool tool-selected');
        }else{
            toolEl.setAttribute('class', 'tool');
        }
        toolEl.addEventListener('click', () => {
            tool.onSelect(tool.id, tool.label);
            toolEls.forEach((t) => {
                let c = t.getAttribute('class') || '';
                const newClass = c.replace(/ ?tool-selected/, '');
                t.setAttribute('class', newClass);
            })
            let classes = (toolEl.getAttribute('class') || '').split(' ').filter((c) => c.length > 0);
            classes.push('tool-selected');
            toolEl.setAttribute('class', classes.join(' '));
        });
        wrapper.append(toolEl);
        return toolEl;
    });

    return wrapper;
}
// <div>Tools: </div>
// <div>🍏Food </div>
// <div>🧱Wall </div>