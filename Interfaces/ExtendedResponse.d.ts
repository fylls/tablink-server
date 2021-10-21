import { Response } from "express"
import { ObjectId } from "mongoose"

export default interface ExtendedResponse extends Response {
  admin: ObjectId
}
