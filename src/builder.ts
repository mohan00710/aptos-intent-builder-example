import {
  Network,
  NetworkToNetworkName,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";
//@ts-ignore
import { BatchArgument } from "@wgb5445/aptos-intent-npm";
import "dotenv/config"

const APTOS_NETWORK: Network = NetworkToNetworkName[Network.CUSTOM];

if(!process.env.PRIVATE_KEY) throw new Error("Missing private key in the env")

const config = new AptosConfig({
  network: APTOS_NETWORK,
  fullnode: "http://127.0.0.1:8080/v1",
});
const aptos = new Aptos(config);

const privateKey = new Ed25519PrivateKey(
  process.env.PRIVATE_KEY
);

const transactionBuilder = async () => {
  const account = await aptos.deriveAccountFromPrivateKey({
    privateKey: privateKey,
  });
  const transaction = await aptos.transaction.build.batched_intents({
    sender: account.accountAddress,
    builder: async (builder :any) => {
      let return_1 = await builder.add_batched_calls({
        function: `0x1::coin::withdraw`,
        functionArguments: [BatchArgument.new_signer(0), 1],
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
      });

      let return_2 = await builder.add_batched_calls({
        function: `0x1::coin::coin_to_fungible_asset`,
        functionArguments: [return_1[0]],
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
      });

      await builder.add_batched_calls({
        function: `0x1::primary_fungible_store::deposit`,
        functionArguments: [account.accountAddress, return_2[0]],
        typeArguments: [],
      });
      return builder;
    },
  });
  const response = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction: transaction,
  });
  console.log("🚀 ~ transactionBuilder ~ response:", response);

  await aptos.waitForTransaction({
    transactionHash: response.hash,
  });
};

// transactionBuilder();

const withDrawAndTransfer = async () => {
  const account = await aptos.deriveAccountFromPrivateKey({
    privateKey: privateKey,
  });

  const transaction = await aptos.transaction.build.batched_intents({
    sender: account.accountAddress,
    builder: async (builder:any) => {
      let return_1 = await builder.add_batched_calls({
        function: `0x1::coin::withdraw`,
        functionArguments: [BatchArgument.new_signer(0), 1],
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
      });
      await builder.add_batched_calls({
        function: `0x1::aptos_account::deposit_coins`,
        functionArguments: ["0xc28d2afe28b6bc998a9f90c27e1db650892e13631eec27db29e6d148fd9d52b7", return_1[0]],
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
      });
      return builder;
    },
  });
  const response = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction: transaction,
  });
  console.log("🚀 ~ transactionBuilder ~ response:", response);

  await aptos.waitForTransaction({
    transactionHash: response.hash,
  });
};

withDrawAndTransfer()