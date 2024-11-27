import { Heading} from "@chakra-ui/react";
import { useTonConnect } from "../hooks/useTonConnect";

const Account = () => {
  const { wallet , connected} = useTonConnect();

  if (!connected) return <p>Disconnected</p>;
  return <p>Account: {wallet}</p>;
}
export default Account