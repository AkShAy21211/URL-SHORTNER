import { nanoid } from "nanoid";

 const createUniqueId = () => {
  return nanoid(7);
};


export default createUniqueId;