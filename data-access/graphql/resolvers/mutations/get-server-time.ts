export default {
    getServerTime: (parent, args, context) => {
        const result = {
          currentTime: Date.now(),
          expirationTime: context?.user?.authToken?.exp,
        };
        if (context.validated) {
          return JSON.stringify(result);
        } else {
          return JSON.stringify({ currentTime: 0, expirationTime: 0 });
        }
    }
}