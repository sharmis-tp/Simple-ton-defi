// @ts-nocheck
import styles from "../styles/action-block.module.css";
import { Input } from "@chakra-ui/input";
import { parseUnits } from 'ethers';
import { Button, Select } from '@chakra-ui/react';
import { ACTIONS, PROTOCOLS, ProtocolNames } from '../constants/constants';
import TokenChooser from "./token-chooser";
import { AddIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { SELECTABLE_TOKENS } from "../constants/constants";
import { ChangeEvent, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion"
import { useTonConnect } from "../hooks/useTonConnect";
import { JETTONS } from "../constants/Jettons";
import TonWeb from 'tonweb';
import { Asset, Factory, JettonRoot, MAINNET_FACTORY_ADDR, PoolType, ReadinessStatus, VaultJetton } from '@dedust/sdk';
import { Address, TonClient4 } from "@ton/ton";
import { fromNano, toNano } from "ton-core";
import { Stonefi } from "../hooks/stonfi";

const ActionBlock = ({ actionName, protocolName, onActionChange, onProtocolChange }) => {
  const x = useMotionValue(0);
  const xPositions = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const [xPos, setXPos] = useState(x);

  const [selectedTokenFrom, setSelectedTokenFrom] = useState<any>(SELECTABLE_TOKENS[0]);
  const [selectedTokenTo, setSelectedTokenTo] = useState<any>(SELECTABLE_TOKENS[1]);

  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");

  const [sellAmount, setSellAmount] = useState<number>();
  const [quote, setQuote] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const { wallet, sender } = useTonConnect();

  const [currentActionName, setCurrentActionName] = useState(actionName || ACTIONS[1].name);
  const [currentProtocolName, setProtocolName] = useState(protocolName || PROTOCOLS[1].name);


  const [lockedBlocks, setLockedBlocks] = useState([]);

  const handleLockAction = () => {
    const newLockedBlock = {
      actionName: currentActionName,
      protocolName: currentProtocolName,
      selectedTokenFrom,
      selectedTokenTo,
      sellAmount,
      quote
    };
    setLockedBlocks([...lockedBlocks, newLockedBlock]);
    // Clear current state values
    setCurrentActionName(currentActionName);
    setProtocolName(currentProtocolName);
    setSelectedTokenFrom(SELECTABLE_TOKENS[0]);
    setSelectedTokenTo(SELECTABLE_TOKENS[1]);
    setSellAmount(sellAmount);
    setQuote(quote);

    setLockedBlocks(prevBlocks => [...prevBlocks, newLockedBlock]);
  };

  const handleGetLockedBlocksData = () => {
    // Use lockedBlocks array to access all the locked blocks' data
    console.log("Locked Blocks Data:", lockedBlocks);
  };

  const handleActionChange = (event) => {
    const selectedActionKey = event.target.value;
    setCurrentActionName(ACTIONS[selectedActionKey].name);
    onActionChange(selectedActionKey); // Ensure this method or state update can handle '0' appropriately
  };

  const handleProtocolChange = (event) => {
    const selectedProtocolKey = event.target.value;
    setProtocolName(PROTOCOLS[selectedProtocolKey].name);
    onProtocolChange(selectedProtocolKey); // Ensure this method or state update can handle '0' appropriately
  };

  // Determine which token list to use based on the protocolName
  const selectableTokens = JETTONS;

  useEffect(() => {
    // Reset selected tokens when protocol changes
    setSelectedTokenFrom(selectableTokens[0]);
    setSelectedTokenTo(selectableTokens[1]);
  }, [protocolName, selectableTokens]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!wallet) return;
    setErrorMessage('');
    const sellAmountValue = Number(event.target.value);
    console.log("Sell Amount valueeee>>>>>", sellAmountValue, event.target.value);
    setSellAmount(sellAmountValue);
    if (currentProtocolName === "STONFI") {

      if (selectedTokenFrom.decimals) {
        const sellamountbaseunit = sellAmountValue * Math.pow(10, selectedTokenFrom.decimals);

        fetch('/api/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({
            offer_address: selectedTokenFrom.address,
            ask_address: selectedTokenTo.address,
            units: sellamountbaseunit,
            slippage_tolerance: 0.001
          })
        })
          .then(response => response.json())
          .then(data => {
            const quote = data.ask_units / Math.pow(10, selectedTokenTo.decimals);
            setQuote(quote.toString());
            console.log("quote set", data.ask_units);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {

        console.log(sellAmountValue, selectedTokenFrom.decimals, "sellAmountValue");
        fetch('/api/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({
            offer_address: selectedTokenFrom.address,
            ask_address: selectedTokenTo.address,
            units: sellAmountValue,
            slippage_tolerance: 0.001
          })
        })
          .then(response => response.json())
          .then(data => {
            const quote = data.ask_units / Math.pow(10, selectedTokenTo.decimals);
            setQuote(quote.toString());
            console.log("quote set", data.ask_units);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    } else if (currentProtocolName === "DEDUST") {
      const sellAmountValue = Number(event.target.value);
      dedustquote(sellAmountValue);
    }
    setLoading(true);
  };


  const handleSwap = async () => {
    if (!wallet || !sellAmount || !quote) return;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    if (protocolName === "STONFI") {
      const stonefi = Stonefi.getInstance();
      const provider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
        apiKey: process.env.NEXT_PUBLIC_APIKEY
      });
      const tokenFrom = selectedTokenFrom.address;
      const tokenTo = selectedTokenTo.address;
      const amountIn = "1";
      // const amountOut = "1";
      try {
        const userfriendly = Address.parse(wallet);
        const walletaddr = userfriendly.toString();
        const swapResult = await stonefi.swap(walletaddr, provider, tokenFrom, tokenTo, amountIn, quote, sender);
        console.log('Swap successful:', swapResult);
      } catch (error) {
        console.error('Error during swap:', error);
      }
    } else if (protocolName === "DEDUST") {
      try {

        await dedustswap();
      } catch (error) {
        console.error('Error during swap:', error);
      }
    }
  };

  useEffect(() => {

  }, [x]);

  const dedustquote = async (sellamount: number) => {
    const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

    const selectedTokenAddressFrom = Address.parse(selectedTokenFrom.address);
    const selectedTokenAddressTo = Address.parse(selectedTokenTo.address);

    const FromToken = Asset.jetton(selectedTokenAddressFrom);
    const ToToken = Asset.jetton(selectedTokenAddressTo);

    console.log("Token Details >>>>", FromToken, ToToken);

    const pool = tonClient.open(await factory.getPool(PoolType.STABLE, [FromToken, ToToken]));



    const bigintselectedTokenFrom = sellamount * Math.pow(10, selectedTokenTo.decimals);
    console.log("BigInt Amount >>>>", bigintselectedTokenFrom, selectedTokenTo.decimals, sellamount)
    const bigintselectedTokenTo = BigInt(Number(amountTo) * Math.pow(10, selectedTokenTo.decimals));

    console.log("Pool Details >>>>", pool);

    const estimateout = await pool.getEstimatedSwapOut({ assetIn: FromToken, amountIn: BigInt(bigintselectedTokenFrom) });
    const amountout = Number(estimateout.amountOut) / Number(Math.pow(10, selectedTokenTo.decimals));

    console.log("Amount Out >>>>", amountout, estimateout);
    setQuote(amountout.toString());
    setLoading(false);
  };

  const dedustswap = async () => {
    const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

    // this is ton vault only used when one token is vault
    const tonVault = tonClient.open(await factory.getNativeVault());

    const selectedTokenAddressFrom = Address.parse(selectedTokenFrom.address);
    const selectedTokenAddressTo = Address.parse(selectedTokenTo.address);

    const scaleVault = tonClient.open(await factory.getJettonVault(selectedTokenAddressFrom));

    const FromToken = Asset.jetton(selectedTokenAddressFrom);
    const ToToken = Asset.jetton(selectedTokenAddressTo);

    const pool = tonClient.open(await factory.getPool(PoolType.VOLATILE, [FromToken, ToToken]));

    const scaleRoot = tonClient.open(JettonRoot.createFromAddress(selectedTokenAddressFrom));
    const scaleWallet = tonClient.open(await scaleRoot.getWallet(sender.address));


    const amountIn = toNano(sellAmount);

    await scaleWallet.sendTransfer(sender, toNano("0.3"), {
      amount: amountIn,
      destination: scaleVault.address,
      responseAddress: sender.address, // return gas to user
      forwardAmount: toNano("0.25"),
      // @ts-ignore
      forwardPayload: VaultJetton.createSwapPayload({ pool }),
    });

    // await tonVault.sendSwap(sender, {
    //   poolAddress: pool.address,
    //   amount: amountIn,
    //   gasAmount: toNano("0.25"),
    // });
  };


  const AddLiquidity = async () => {

    const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

    console.log("Amount From and TO >>>>", sellAmount, quote)

    const fromAmount = toNano(sellAmount);
    const toAmount = toNano(quote);

    const selectedTokenAddressFrom = Address.parse(selectedTokenFrom.address);
    const selectedTokenAddressTo = Address.parse(selectedTokenTo.address);

    const FromToken = Asset.jetton(selectedTokenAddressFrom);
    const ToToken = Asset.jetton(selectedTokenAddressTo);

    console.log("Token Details >>>>", FromToken, ToToken);

    const assets: [Asset, Asset] = [FromToken, ToToken];
    const targetBalances: [bigint, bigint] = [fromAmount, toAmount];

    const fromTokenVault = tonClient.open(await factory.getJettonVault(selectedTokenAddressFrom));
    const fromTokenRoot = tonClient.open(JettonRoot.createFromAddress(selectedTokenAddressFrom));
    const fromWallet = tonClient.open(await fromTokenRoot.getWallet(sender.address));

    await fromWallet.sendTransfer(sender, toNano('0.5'), {
      amount: toAmount,
      destination: fromTokenVault.address,
      responseAddress: sender.address,
      forwardAmount: toNano('0.4'),
      forwardPayload: VaultJetton.createDepositLiquidityPayload({
        poolType: PoolType.VOLATILE,
        assets,
        targetBalances,
      }),
    });

    const toVault = tonClient.open(await factory.getJettonVault(selectedTokenAddressTo));

    const toRoot = tonClient.open(JettonRoot.createFromAddress(selectedTokenAddressTo));
    const toWallet = tonClient.open(await toRoot.getWallet(sender.address));

    await toWallet.sendTransfer(sender, toNano('0.5'), {
      amount: toAmount,
      destination: toVault.address,
      responseAddress: sender.address,
      forwardAmount: toNano('0.4'),
      forwardPayload: VaultJetton.createDepositLiquidityPayload({
        poolType: PoolType.VOLATILE,
        assets,
        targetBalances,
      }),
    });

  }

  const handlesubmit = async (actionname: string) => {
    if (actionname == "Swap") {
      handleSwap();
    } else if (actionname == "Add Liquidity") {
      AddLiquidity();
    }
  }

  const removeLiquidity = async () => {
    const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

    const selectedTokenAddressFrom = Address.parse(selectedTokenFrom.address);
    const selectedTokenAddressTo = Address.parse(selectedTokenTo.address);

    const FromToken = Asset.jetton(selectedTokenAddressFrom);
    const ToToken = Asset.jetton(selectedTokenAddressTo);

    const pool = tonClient.open(await factory.getPool(PoolType.VOLATILE, [FromToken, ToToken]));
    const lpWallet = tonClient.open(await pool.getWallet(sender.address));

    await lpWallet.sendBurn(sender, toNano('0.5'), {
      amount: await lpWallet.getBalance(),
    });

  }


  return (
    <div className={styles.block}>
      <div className={styles.actionNameWrapper}>
        <h3 className={styles.actionName}>{currentActionName}</h3>
      </div>
      <p className={styles.protocolName}>{currentProtocolName}</p>
      <Select value={actionName} onChange={handleActionChange} color="greenyellow">
        {Object.keys(ACTIONS).map((key) => (
          <option key={key} value={key}>
            {ACTIONS[key].name}
          </option>
        ))}
      </Select>
      <Select value={protocolName} onChange={handleProtocolChange} color="greenyellow">
        {Object.keys(PROTOCOLS).map((key) => (
          <option key={key} value={key}>
            {PROTOCOLS[key].name}
          </option>
        ))}
      </Select>
      <div className={styles.actionInputsWrapper}>
        <div className={styles.actionInputField}>
          <TokenChooser
            selectedToken={selectedTokenFrom}
            setSelectedToken={setSelectedTokenFrom}
            selectableTokens={selectableTokens}
          />
          <Input
            placeholder="Input amount"
            color="gray.300"
            height={"3rem"}
            borderRadius="md"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "gray.500" }}
            onChange={handleChangeInput} disabled={loading}
          />
        </div>
        {currentActionName == "Add Liquidity" || currentActionName == "Remove Liquidity" ? <AddIcon w={10} h={10} color={"#fff"} /> : <ArrowDownIcon w={10} h={10} color={"#fff"} />}
        <div className={styles.actionInputField}>
          <TokenChooser
            selectedToken={selectedTokenTo}
            setSelectedToken={setSelectedTokenTo}
            selectableTokens={selectableTokens}
          />
          <Input
            readOnly
            placeholder="Output amount"
            color="gray.300"
            height={"3rem"}
            borderRadius="md"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "gray.500" }}
            value={quote ? quote : ''}
          />
        </div>
        <div>
          {loading ? <p style={{ color: 'green' }}>Loading...</p> : <Button style={{ color: 'green' }} onClick={() => handlesubmit(currentActionName)}>{currentActionName}</Button>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>Success</p>}
        </div>

        <div onClick={removeLiquidity}> Remove Liquidity </div>

        <Button onClick={handleLockAction}>Lock This Action 🔒</Button>
        <Button onClick={handleGetLockedBlocksData}>Execute Locked Blocks 🔥</Button>
      </div>
    </div>
  );
};
export default ActionBlock;
