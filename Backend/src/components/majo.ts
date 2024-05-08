import { joinUrl } from "@/bin/server";
import axios, { AxiosError } from "axios";

type Armor = {
  id: string;
  loc: string;
  desc: string;
};

type Majo = {
  name: string;
  leve: string;
  armor: {
    head: Armor;
    body: Armor;
  };
};

var data = {};

const initMajo = async (map: Record<string, string>) => {
  let endpoint = map.majo;
  try {
    let { mappings } = (
      await axios.get(joinUrl(endpoint, "conf", "_conf.json"))
    ).data;
    for (let key in mappings) {
      //let { data } = await axios.get(joinUrl(endpoint, "conf", mappings[key]));
      console.log(`Data in ${mappings[key]}`);
      //console.log(data);
    }
    console.log(`Data mappings: ${Object.keys(mappings).join()}`);
  } catch (e) {
    let { code, config } = e as AxiosError;
    console.log(`Caught unexpected error on requesting ${config?.url}`);
    console.log(code);
    process.exit(1);
  }
};

export { initMajo };
