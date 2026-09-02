import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Driver, LatLng, LatLngSchema } from "./common_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file driver_location.proto.
 */
export declare const file_driver_location: GenFile;
/**
 * @generated from message goto.v1.SetPositionRequest
 */
export type SetPositionRequest = Message<"goto.v1.SetPositionRequest"> & {
    /**
     * @generated from field: string driver_id = 1;
     */
    driverId: string;
    /**
     * @generated from field: goto.v1.LatLng position = 2;
     */
    position?: LatLng | undefined;
};
/**
 * Describes the message goto.v1.SetPositionRequest.
 * Use `create(SetPositionRequestSchema)` to create a new message.
 */
export declare const SetPositionRequestSchema: GenMessage<SetPositionRequest>;
/**
 * @generated from message goto.v1.GetPositionsRequest
 */
export type GetPositionsRequest = Message<"goto.v1.GetPositionsRequest"> & {};
/**
 * Describes the message goto.v1.GetPositionsRequest.
 * Use `create(GetPositionsRequestSchema)` to create a new message.
 */
export declare const GetPositionsRequestSchema: GenMessage<GetPositionsRequest>;
/**
 * @generated from message goto.v1.GetPositionsResponse
 */
export type GetPositionsResponse = Message<"goto.v1.GetPositionsResponse"> & {
    /**
     * @generated from field: repeated goto.v1.Driver driver = 1;
     */
    driver: Driver[];
};
/**
 * Describes the message goto.v1.GetPositionsResponse.
 * Use `create(GetPositionsResponseSchema)` to create a new message.
 */
export declare const GetPositionsResponseSchema: GenMessage<GetPositionsResponse>;
/**
 * @generated from message goto.v1.SetPositionResponse
 */
export type SetPositionResponse = Message<"goto.v1.SetPositionResponse"> & {
    /**
     * @generated from field: bool ok = 1;
     */
    ok: boolean;
};
/**
 * Describes the message goto.v1.SetPositionResponse.
 * Use `create(SetPositionResponseSchema)` to create a new message.
 */
export declare const SetPositionResponseSchema: GenMessage<SetPositionResponse>;
/**
 * @generated from message goto.v1.StreamPositionsResponse
 */
export type StreamPositionsResponse = Message<"goto.v1.StreamPositionsResponse"> & {
    /**
     * @generated from field: bool ok = 1;
     */
    ok: boolean;
    /**
     * @generated from field: uint32 received = 2;
     */
    received: number;
};
/**
 * Describes the message goto.v1.StreamPositionsResponse.
 * Use `create(StreamPositionsResponseSchema)` to create a new message.
 */
export declare const StreamPositionsResponseSchema: GenMessage<StreamPositionsResponse>;
/**
 * @generated from service goto.v1.DriverPositionService
 */
export declare const DriverPositionService: GenService<{
    /**
     * @generated from rpc goto.v1.DriverPositionService.SetPosition
     */
    setPosition: {
        methodKind: "unary";
        input: typeof SetPositionRequestSchema;
        output: typeof SetPositionResponseSchema;
    };
    /**
     * @generated from rpc goto.v1.DriverPositionService.StreamPositions
     */
    streamPositions: {
        methodKind: "client_streaming";
        input: typeof LatLngSchema;
        output: typeof StreamPositionsResponseSchema;
    };
    /**
     * @generated from rpc goto.v1.DriverPositionService.GetPositions
     */
    getPositions: {
        methodKind: "unary";
        input: typeof GetPositionsRequestSchema;
        output: typeof GetPositionsResponseSchema;
    };
}>;
//# sourceMappingURL=driver_location_pb.d.ts.map