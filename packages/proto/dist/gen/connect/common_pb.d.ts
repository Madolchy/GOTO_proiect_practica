import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file common.proto.
 */
export declare const file_common: GenFile;
/**
 * @generated from message goto.v1.LatLng
 */
export type LatLng = Message<"goto.v1.LatLng"> & {
    /**
     * @generated from field: double lat = 1;
     */
    lat: number;
    /**
     * @generated from field: double lng = 2;
     */
    lng: number;
};
/**
 * Describes the message goto.v1.LatLng.
 * Use `create(LatLngSchema)` to create a new message.
 */
export declare const LatLngSchema: GenMessage<LatLng>;
/**
 * @generated from message goto.v1.Driver
 */
export type Driver = Message<"goto.v1.Driver"> & {
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
 * Describes the message goto.v1.Driver.
 * Use `create(DriverSchema)` to create a new message.
 */
export declare const DriverSchema: GenMessage<Driver>;
//# sourceMappingURL=common_pb.d.ts.map