
// Batch component

import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import ActionBlock from '../components/action-block';
import { ACTIONS, ProtocolNames } from '../constants/constants';

import styles from '../styles/batch.module.css';
import {Reorder} from "framer-motion";
import { useTonConnect } from '../hooks/useTonConnect';

const Batch = () => {

  const { wallet } = useTonConnect();
  const [actionBlocks, setActionBlocks] = useState([
    { id: 1, action: Object.keys(ACTIONS)[1], protocol: Object.keys(ProtocolNames)[1] },
  ]);

  const addActionBlock = () => {
    const newBlock = {
      id: actionBlocks.length + 1,
      action: Object.keys(ACTIONS)[1], // Default to the first action
      protocol: Object.keys(ProtocolNames)[1], // Default to the first protocol
    };
    setActionBlocks([...actionBlocks, newBlock]);
  };

  const removeActionBlock = (id) => {
    const updatedBlocks = actionBlocks.filter((block) => block.id !== id);
    setActionBlocks(updatedBlocks);
  }

  const updateActionBlock = (id, field, value) => {
    const updatedBlocks = actionBlocks.map((block) =>
      block.id === id ? { ...block, [field]: value } : block
    );
    setActionBlocks(updatedBlocks);
  };

  const renderDisconnected = () => {
    return (
      <Flex
        marginTop={"50px"}>
        Connect your Wallet to start
      </Flex>
    )
  }
  const renderConnected = () => {
  return (
    <div className={styles.container}>
        <Reorder.Group
          as="ul"
          className={styles.actionsWrapper}
          axis="x"
          values={actionBlocks}
          onReorder={setActionBlocks}
          layoutScroll
          style={{overflowX: "scroll"}}
        >
      {actionBlocks.map((block) => (
        <Reorder.Item key={block.id} value={block}>
        <ActionBlock
          key={block.id}
          actionName={ACTIONS[block.action]?.name}
          protocolName={ProtocolNames[block.protocol]}
          onActionChange={(action) => updateActionBlock(block.id, 'action', action)}
          onProtocolChange={(protocol) => updateActionBlock(block.id, 'protocol', protocol)}
        />
        </Reorder.Item>
      ))}
      </Reorder.Group>
      <Button onClick={addActionBlock} mt="8">
        ➕ Action Block
      </Button>
      <Button onClick={() => removeActionBlock(actionBlocks.length)} mt="8">
        ❌ Latest Block
      </Button>
      </div>
 )
}

return (
  <>
    {wallet && renderConnected()}
    {!wallet && renderDisconnected()}
  </>
)

}
export default Batch;
