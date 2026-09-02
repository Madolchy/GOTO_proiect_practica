import { Observable } from "rxjs";
import { LatLng } from "./common.js";
export declare const protobufPackage = "goto.v1";
export interface GetPriceRequest {
    origin: LatLng | undefined;
    destination: LatLng | undefined;
}
export interface GetPriceResponse {
    price: number;
    currency: string;
}
export declare const GOTO_V1_PACKAGE_NAME = "goto.v1";
export interface PriceServiceClient {
    getPrice(request: GetPriceRequest): Observable<GetPriceResponse>;
}
export interface PriceServiceController {
    getPrice(request: GetPriceRequest): Promise<GetPriceResponse> | Observable<GetPriceResponse> | GetPriceResponse;
}
export declare function PriceServiceControllerMethods(): (constructor: Function) => void;
export declare const PRICE_SERVICE_NAME = "PriceService";
//# sourceMappingURL=price.d.ts.map