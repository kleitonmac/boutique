const TemplateExpression  = () => {
    const name = 'Kleiton';
    const data = {
        age: 27,
        job: 'Desenvolvedor'
    };
    return (
        <div>
            <h1>Olá {name}, tudo bem com você?
                <h2> Você atua em qual profissão {data.job}, e tenho {data.age}</h2>
            </h1>
        </div>
    );
};

export default TemplateExpression;