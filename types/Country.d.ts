import { Region } from "./Region";


export type Country = {
  countryName: string; 
  phoneCode: string; 
  countryShortCode: string; 
  countryFlag: string; 
  regions: Region[]; 
};