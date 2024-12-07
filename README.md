# Aptos Intent Builder

The Aptos Intent Builder is currently under development and works only on the local network (loclnet).

## Instructions to Run

1. Clone the repository.
2. Run `chmod +x ./install.sh` to give execute permissions to the install script.
3. Run `./install.sh` to install a specific version of the Aptos TS SDK from a GitHub branch.
4. Run `npm install` to install the necessary dependencies.
5. Execute `ts-node src/builder.ts` to run the intent builder example.

## Important Notes
- Make sure you install https://www.npmjs.com/package/@aptos-labs/ts-sdk/v/1.33.0-sc.1 as one of your dependencies

- Set your `PRIVATE_KEY` in the `.env` file 

