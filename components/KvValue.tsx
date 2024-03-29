import { type ComponentChildren } from "preact";
import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvValueJSON } from "@kitsonk/kv-toolbox/json";
import { format } from "@std/fmt/bytes";
import { highlightJson } from "$utils/highlight.ts";

import { HexViewer } from "./HexViewer.tsx";

function Display({ children }: { children: ComponentChildren }) {
  return (
    <div class="rounded p-1 bg-gray(100 dark:800) max-h-64 lg:max-h-96 overflow-y-auto overflow-x-auto">
      {children}
    </div>
  );
}

export function KvValue(
  { value, meta }: { value?: KvValueJSON; meta?: BlobMeta },
) {
  let color;
  let label;
  let children;
  let border = false;

  if (meta) {
    switch (meta.kind) {
      case "blob":
        label = "Blob";
        color = "gray";
        border = true;
        children = (
          <Display>
            <table class="w-full">
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>
                    <code>{meta.type}</code>
                  </td>
                </tr>
                {meta.size
                  ? (
                    <tr>
                      <td>Size:</td>
                      <td>{format(meta.size)}</td>
                    </tr>
                  )
                  : undefined}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "buffer":
        label = "Uint8Array (blob)";
        color = "gray";
        border = true;
        children = (
          <Display>
            <table class="w-full">
              <tbody>
                {meta.size
                  ? (
                    <tr>
                      <td>Size:</td>
                      <td>{format(meta.size)}</td>
                    </tr>
                  )
                  : undefined}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "file":
        label = "File";
        color = "gray";
        border = true;
        children = (
          <Display>
            <table class="w-full">
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>
                    <code>{meta.type}</code>
                  </td>
                </tr>
                <tr>
                  <td>Filename:</td>
                  <td>
                    <code>{meta.name}</code>
                  </td>
                </tr>
                {meta.lastModified
                  ? (
                    <tr>
                      <td>Last modified:</td>
                      <td>{new Date(meta.lastModified).toISOString()}</td>
                    </tr>
                  )
                  : undefined}
                {meta.size
                  ? (
                    <tr>
                      <td>Size:</td>
                      <td>{format(meta.size)}</td>
                    </tr>
                  )
                  : undefined}
              </tbody>
            </table>
          </Display>
        );
        break;
    }
  } else if (value) {
    switch (value.type) {
      case "KvU64":
        label = "Deno.KvU64";
        color = "pink";
        children = <Display>{value.value}n</Display>;
        break;
      case "Map":
        label = "Map";
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="p-2">Key</th>
                  <th class="p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {value.value.map(([key, value]) => (
                  <tr class="odd:bg-gray(50 dark:900)">
                    <td>
                      <pre><code>{JSON.stringify(key, undefined, "  ")}</code></pre>
                    </td>
                    <td>
                      <pre><code>{JSON.stringify(value, undefined, "  ")}</code></pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "RegExp":
        label = "RegExp";
        color = "yellow";
        children = (
          <Display>
            <pre><code>{value.value}</code></pre>
          </Display>
        );
        break;
      case "Set":
        label = "Set";
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="p-2">Item</th>
                </tr>
              </thead>
              <tbody>
                {value.value.map((item) => (
                  <tr class="odd:bg-gray(50 dark:900)">
                    <td>
                      <pre><code>{JSON.stringify(item, undefined, "  ")}</code></pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "Uint8Array":
        label = "Uint8Array";
        color = "gray";
        border = true;
        children = (
          <HexViewer
            value={value.value}
            class="max-h-64 lg:max-h-96 overflow-x-auto"
          />
        );
        break;
      case "bigint":
        label = "BigInt";
        color = "indigo";
        children = <Display>{value.value}n</Display>;
        break;
      case "boolean":
        label = "Boolean";
        color = "green";
        children = (
          <Display>
            <span class="font-bold">{String(value.value)}</span>
          </Display>
        );
        break;
      case "null":
        label = "Null";
        color = "gray";
        border = true;
        children = (
          <Display>
            <span class="font-bold italic text-gray-500">null</span>
          </Display>
        );
        break;
      case "undefined":
        label = "Undefined";
        color = "gray";
        border = true;
        children = (
          <Display>
            <span class="font-bold italic text-gray-500">undefined</span>
          </Display>
        );
        break;
      case "number":
        label = "Number";
        color = "purple";
        children = <Display>{value.value}</Display>;
        break;
      case "Date":
        label = "Date";
        color = "orange";
        children = <Display>{value.value}</Display>;
        break;
      case "Error":
        label = "Error";
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>{value.type}</td>
                </tr>
                <tr>
                  <td>Message:</td>
                  <td>{value.value.message}</td>
                </tr>
                {value.value.stack && (
                  <tr>
                    <td>Stack:</td>
                    <td>
                      <pre>{value.value.stack}</pre>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "object":
        label = "JSON";
        color = "blue";
        children = (
          <Display>
            <pre><code dangerouslySetInnerHTML={{ __html: highlightJson(value.value) }}></code></pre>
          </Display>
        );
        break;
      case "string":
        label = "String";
        color = "blue";
        children = (
          <Display>
            <pre><code>{value.value}</code></pre>
          </Display>
        );
    }
  }

  return (
    <div>
      <h2 class="font-bold my-2">Type</h2>
      <div>
        <div
          class={`bg-${color}-100 text-${color}-800 px-2.5 py-0.5 m-1 inline-block rounded dark:(bg-${color}-900 text-${color}-300) ${
            border ? "border" : ""
          }`}
        >
          {label}
        </div>
      </div>
      <h2 class="font-bold my-2">Value</h2>
      {children}
    </div>
  );
}
