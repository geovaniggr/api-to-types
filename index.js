const capitalize = (val) => val[0].toUpperCase().concat(val.slice(1))

const isUniform = (value) => {
    const firstElement = typeof(value[0]);

    const hasOtherType = value.findIndex( val => typeof(val) !== firstElement)

    return hasOtherType === - 1;
}

const getType = (key, value) => {
    const type = typeof(value);

    if(type !== 'object'){
        return type;
    }

    if(value == null){
        return "any"
    }

    if(value instanceof Date) {
        return "Date"
    }

    const isArray = Array.isArray(value);

    if(isArray) {
        const [first, _] = value
        return isUniform(value)
               ? `${getType(key, first)}[]`
               : 'any[]';
    }

    return capitalize(key)
}

const mapper = (name, data) => {
    const types =  Object
                    .entries(data)
                    .map( ([key, value]) => `\t${key} : ${getType(key, value)};`)
                    .reduce( (acc, act) => acc.concat(act).concat("\n"), "\n")

    return `type ${capitalize(name)} = {${types}}`;
}

const isObject = (value) => value != null && typeof(value) === 'object' && !Array.isArray(value);
const isArray = (value) => Array.isArray(value) && isObject(value[0])

const parser = (writer, name, json) => {
    const entries = Object.entries(json);

    const objects = entries.filter( ([_, value]) => isObject(value));
    const objectsInsideArray = entries.filter( ([_, value]) => isArray(value))

    objects.forEach( ([key, value]) => parser(writer, key, value))
    objectsInsideArray.forEach( ([key, [first, _]]) => parser(writer, key, first))

    writer.write(`\n// Creating ${name} types: \n`)
    writer.write(mapper(name, json));
}

export default (name,writer, json) => parser(writer, name, json)