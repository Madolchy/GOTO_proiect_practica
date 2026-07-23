import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import path from 'path';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PRICE_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'goto.v1',
                    protoPath: path.join(__dirname, '../proto/price.proto'),
                    url: 'localhost:5200',
                },
            },
        ]),
    ],
    controllers: [PriceController],
    providers: [PriceService],
})
export class PriceModule {}
