import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { response } from 'express';
import { Dirent } from 'fs';
import { env } from 'process';
import { lastValueFrom, map } from 'rxjs';
@Injectable()
export class AppService {

  jsonMap: any = {}

  constructor(private readonly httpService: HttpService) {
    var fs = require('fs');
    var path = require('path')
    fs.readdir("files", (err, files) => {

      files.forEach(file => {
        var filepath = path.join("files", file)
        console.log(filepath);
        let json = fs.readFileSync(filepath);
        this.jsonMap[file] = JSON.parse(json)
      });
    });
  }

  async getDescription(did: string): Promise<string> {
    var json = ""
    var type = ""
    /*
      SD Storage must be docked here according to linked DID. Just a simulation for now. 
    */

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:datacentre1") {
      json = this.jsonMap["datacenter1.json"]
      type = "DataCenterCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:datacentre2") {
      json = this.jsonMap["datacenter2.json"]
      type = "DataCenterCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:provider") {
      json = this.jsonMap["provider.json"]
      type = "ProviderCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:cloudService1") {
      json = this.jsonMap["service.json"]
      type = "CloudServiceCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:certificate1") {
      json = this.jsonMap["certificate.json"]
      type = "CertificateCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:cloudService1") {
      json = this.jsonMap["service1.json"]
      type = "ServiceCatalogDescriptionCredential"
    }


    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:cloudService2") {
      json = this.jsonMap["service2.json"]
      type = "ServiceCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:legalInformation") {
      json = this.jsonMap["legalInformation.json"]
      type = "LegalInformationCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:companyProfile") {
      json = this.jsonMap["companyProfile.json"]
      type = "CompanyProfileCatalogDescriptionCredential"
    }

    if (did == "did:web:integration.gxfs.dev:api:dynamic:did:auditablityProfile") {
      json = this.jsonMap["auditabilityProfile.json"]
      type = "AuditablityProfileCatalogDescriptionCredential"
    }

    if (json == "")
      throw new BadRequestException("No Description found.");

    let payload = {}


    let credential = {}
    credential["@context"] = ["https://www.w3.org/2018/credentials/v1", "http://schema.org"]
    credential["id"] = "urn:test:" + randomUUID().toString()
    credential["type"] = ["VerifiableCredential", type]
    credential["issuer"] = did
    credential["issuanceDate"] = new Date().toISOString()
    credential["credentialSubject"] = {}
    credential["credentialSubject"]["id"] = did
    credential["credentialSubject"]["description"] = json

    payload["key"] = "key-1"
    payload["namespace"] = "did-management." + did.replace(/:/g, "-")
    payload["credential"] = credential
    // console.log(JSON.stringify(json))
    console.log(JSON.stringify(payload))
    return lastValueFrom(this.httpService.post(process.env.SIGNER_SERVICE, payload).pipe(map(response => response.data)))

  }
}
