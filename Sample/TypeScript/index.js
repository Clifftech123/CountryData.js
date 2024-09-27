"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const countrydata_js_1 = require("countrydata.js");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const allCountries = yield countryHelper.getCountries();
    console.log(JSON.stringify(allCountries, null, 2));
}))();
// Get country by short code
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const countryData = yield countryHelper.getCountryByShortCode('US');
    console.log(countryData);
}))();
// Get regions in a particular country
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const regionsData = yield countryHelper.getRegionsByCountryShortCode('GH');
    console.log(regionsData);
}))();
// Get country Country Flag
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const countryData = yield countryHelper.getCountryByShortCode('US');
    console.log(countryData === null || countryData === void 0 ? void 0 : countryData.countryFlag);
}))();
// Get country by phone code
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const countryData = yield countryHelper.getCountryByPhoneCode('+233');
    console.log(countryData);
}))();
// Get country phone code by short code
(() => __awaiter(void 0, void 0, void 0, function* () {
    const countryHelper = new countrydata_js_1.CountryHelper();
    const phoneCode = yield countryHelper.getCountryPhoneCodeByShortCode('US');
    console.log(phoneCode);
}))();
