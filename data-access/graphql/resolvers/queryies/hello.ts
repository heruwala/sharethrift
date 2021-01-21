export default {
    hello: (parent, args, context) => {
        return `Hello world! ${JSON.stringify(context)}`;
    }
}