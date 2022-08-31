const axios = require("axios");

axios.get('https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy').then(res => CalcularPoliza(res.data)).catch(err => console.log(err));

function CalcularPoliza(res) {
    let baseEmpleadoSinHijo = 0.279;
    let baseEmpleadoUnHijo = 0.4396;
    let baseEmpleadoDosHijo = 0.5599;

    const dentalEmpleadoSinHijo = 0.12;
    const dentalEmpleadoUnHijo = 0.1950;
    const dentalEmpleadoDosHijo = 0.2480;

    const cobertura = res.policy.company_percentage;

    const workers = res.policy.workers[0];
    const validWorkers = workers.filter( (worker) => worker.age <= 65);

    if(res.policy.has_dental_care) {
        baseEmpleadoSinHijo += dentalEmpleadoSinHijo;
        baseEmpleadoUnHijo += dentalEmpleadoUnHijo;
        baseEmpleadoDosHijo += dentalEmpleadoDosHijo;
    }

    const workersConCosto = validWorkers.map( (worker) => ({ ...worker, Costo: (worker.childs === 0) ? (baseEmpleadoSinHijo) : ( (worker.childs === 1) ? (baseEmpleadoUnHijo) : (baseEmpleadoDosHijo) ) }));

    let costoPoliza = workersConCosto.reduce( (acc, cur) => {
        return acc + cur.Costo;
    }, 0) * (cobertura/100);

    console.log("SUPUESTO: El valor de la poliza no se multiplica por hijo para los casos de 2 o más hijos, es decir, el copago con 2 hijos es el mismo que si fueran 5 hijos por ejemplo");
    console.log("Costo Total Poliza: " + costoPoliza);
    console.log("Detalle de Copago por Trabajador:");
    console.log(workersConCosto);
}