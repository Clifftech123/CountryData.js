export type Country = {
    countryName: string;
    phoneCode: string;
    countryShortCode: string;
    countryFlag: string;
    regions: Region[];
};
export type Region = {
    Name: string;
    ShortCode: string;
};
