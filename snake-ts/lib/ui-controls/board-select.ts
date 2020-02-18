/**
 * 
 */
export const createBoardSelect = (options: string[], selected?: string) => {

    const select = document.createElement("select");

    select.setAttribute('name', 'boar-select');
    select.setAttribute('id', 'boar-select');

    options.forEach((opt) => {
        const option = document.createElement(`option`);
        option.setAttribute('value', opt);
        option.innerText = opt;
        if (selected === opt) {
            option.setAttribute('selected', opt);
        }
        select.appendChild(option);
    });
    return select;
}

