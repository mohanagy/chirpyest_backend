
# configuration

1. .env.example is a blueprint for all configration  needed for the project
2. copy .env.example and replace .example depends on your environment
3. for example (development| local) the file should be .env.development
4. for testing , you need to create .env.tests

# Development Mode

1. Clone the repo
2. `npm i`
3. `npm run dev`
4. hit the `localhost:4000` to get `Hello, World!` response
  
# Test Mode

1. `npm run test:local`
2. `npm run test:local:watch` for watching the changes
3. `npm run test:local:report` to access test report and coverage

Note: Eslint should work with no extra config. you only need the vscode `eslint` extension. Please report a bug for any issues