import { Observable } from "rxjs";
import { Driver, LatLng } from "./common.js";
export declare const protobufPackage = "goto.v1";
export interface SetPositionRequest {
    driverId: string;
    position: LatLng | undefined;
}
export interface GetPositionsRequest {
}
export interface GetPositionsResponse {
    driver: Driver[];
}
export interface SetPositionResponse {
    ok: boolean;
}
export interface StreamPositionsResponse {
    ok: boolean;
    received: number;
}
export declare const GOTO_V1_PACKAGE_NAME = "goto.v1";
export interface DriverPositionServiceClient {
    setPosition(request: SetPositionRequest): Observable<SetPositionResponse>;
    streamPositions(request: Observable<LatLng>): Observable<StreamPositionsResponse>;
    getPositions(request: GetPositionsRequest): Observable<GetPositionsResponse>;
}
export interface DriverPositionServiceController {
    setPosition(request: SetPositionRequest): Promise<SetPositionResponse> | Observable<SetPositionResponse> | SetPositionResponse;
    streamPositions(request: Observable<LatLng>): Promise<StreamPositionsResponse> | Observable<StreamPositionsResponse> | StreamPositionsResponse;
    getPositions(request: GetPositionsRequest): Promise<GetPositionsResponse> | Observable<GetPositionsResponse> | GetPositionsResponse;
}
export declare function DriverPositionServiceControllerMethods(): (constructor: Function) => void;
export declare const DRIVER_POSITION_SERVICE_NAME = "DriverPositionService";
//# sourceMappingURL=driver_location.d.ts.map