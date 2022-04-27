import React, { Component, useState } from "react";
import * as FS from "expo-file-system";

export default async function toServer(mediaFile) {
  let type = mediaFile.type;
  let schema = "http://";
  let host = "172.26.12.119";
  let route = "";
  let port = "5000";
  let url = "";
  let content_type = "";
  type === "image"
    ? ((route = "/image"), (content_type = "image/jpeg"))
    : ((route = "/video"), (content_type = "video/mp4"));
  url = schema + host + ":" + port + route;

  let response = await FS.uploadAsync(url, mediaFile.uri, {
    headers: {
      "content-type": content_type,
    },
    httpMethod: "POST",
    uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
  });
}
