import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Documentacion de mi API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components:{
    schemas: {
        user: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
            },
            mail: {
              type: "string",
            },
            cuil: {
                type:"string",
            },
            phoneNumber:{
                type:"string",
            },
            passport:{
                type:"string",
            },
            id:{
                type:"string",
            },

          },
        },
        paymentData:{
            type: "object",
            required: ["toUserKeyType","toUserKey","amount"],
            properties: {
                toUserKeyType: {
                  type: "string",
                },
                toUserKey: {
                    type: "string",
                  },
                  amount: {
                    type: "number",
                  },
    
              },
        }
  },
  },
};

const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts"],
  };
  
  export default swaggerJSDoc(swaggerOptions);