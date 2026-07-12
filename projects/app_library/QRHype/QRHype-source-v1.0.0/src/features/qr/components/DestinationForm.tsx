import { SOCIAL_PLATFORMS } from "../constants";
import { useFormSlice } from "../state";
import type { QrType, ValidationResult } from "../types";
import {
  Segmented,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/ui/field";

type Errors = ValidationResult["errors"];

function UrlForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("url");
  return (
    <TextField
      label="Website address"
      required
      type="url"
      inputMode="url"
      placeholder="yoursite.com"
      value={form.url}
      onChange={(url) => patch({ url })}
      hint="No need to type https, we add it for you."
      error={errors.url}
    />
  );
}

function TextForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("text");
  return (
    <TextAreaField
      label="Text"
      required
      rows={4}
      placeholder="Anything you want the code to display."
      value={form.text}
      onChange={(text) => patch({ text })}
      error={errors.text}
    />
  );
}

function EmailForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("email");
  return (
    <div className="space-y-4">
      <TextField
        label="Send to"
        required
        type="email"
        inputMode="email"
        placeholder="name@example.com"
        value={form.to}
        onChange={(to) => patch({ to })}
        error={errors.to}
      />
      <TextField
        label="Subject"
        placeholder="Optional subject line"
        value={form.subject}
        onChange={(subject) => patch({ subject })}
      />
      <TextAreaField
        label="Message"
        placeholder="Optional message body"
        value={form.body}
        onChange={(body) => patch({ body })}
      />
    </div>
  );
}

function PhoneForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("phone");
  return (
    <TextField
      label="Phone number"
      required
      type="tel"
      inputMode="tel"
      placeholder="+1 843 555 0199"
      value={form.phone}
      onChange={(phone) => patch({ phone })}
      hint="Include the country code for reliable dialing."
      error={errors.phone}
    />
  );
}

function SmsForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("sms");
  return (
    <div className="space-y-4">
      <TextField
        label="Phone number"
        required
        type="tel"
        inputMode="tel"
        placeholder="+1 843 555 0199"
        value={form.phone}
        onChange={(phone) => patch({ phone })}
        error={errors.phone}
      />
      <TextAreaField
        label="Message"
        placeholder="Optional pre-filled message"
        value={form.message}
        onChange={(message) => patch({ message })}
      />
    </div>
  );
}

function WifiForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("wifi");
  const noPass = form.encryption === "nopass";
  return (
    <div className="space-y-4">
      <TextField
        label="Network name (SSID)"
        required
        value={form.ssid}
        onChange={(ssid) => patch({ ssid })}
        placeholder="Exactly as it appears"
        error={errors.ssid}
      />
      <Segmented
        label="Security"
        value={form.encryption}
        onChange={(encryption) => patch({ encryption })}
        options={[
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "None" },
        ]}
      />
      {!noPass ? (
        <TextField
          label="Password"
          required
          value={form.password}
          onChange={(password) => patch({ password })}
          placeholder="Network password"
          error={errors.password}
        />
      ) : null}
      <SwitchField
        label="Hidden network"
        hint="Turn on if the network name is not broadcast."
        checked={form.hidden}
        onChange={(hidden) => patch({ hidden })}
      />
    </div>
  );
}

function VCardForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("vcard");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          value={form.firstName}
          onChange={(firstName) => patch({ firstName })}
          error={errors.firstName}
        />
        <TextField
          label="Last name"
          value={form.lastName}
          onChange={(lastName) => patch({ lastName })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Organization"
          value={form.organization}
          onChange={(organization) => patch({ organization })}
        />
        <TextField label="Title" value={form.title} onChange={(title) => patch({ title })} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Phone"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(phone) => patch({ phone })}
          error={errors.phone}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          value={form.email}
          onChange={(email) => patch({ email })}
          error={errors.email}
        />
      </div>
      <TextField
        label="Website"
        type="url"
        inputMode="url"
        value={form.website}
        onChange={(website) => patch({ website })}
        error={errors.website}
      />
      <TextField
        label="Address"
        value={form.address}
        onChange={(address) => patch({ address })}
      />
      <TextAreaField
        label="Notes"
        rows={2}
        value={form.notes}
        onChange={(notes) => patch({ notes })}
      />
    </div>
  );
}

function WhatsAppForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("whatsapp");
  return (
    <div className="space-y-4">
      <TextField
        label="Phone number with country code"
        required
        type="tel"
        inputMode="tel"
        placeholder="1 843 555 0199"
        value={form.phone}
        onChange={(phone) => patch({ phone })}
        hint="Digits only, starting with the country code."
        error={errors.phone}
      />
      <TextAreaField
        label="First message"
        placeholder="Optional message to start the chat"
        value={form.message}
        onChange={(message) => patch({ message })}
      />
    </div>
  );
}

function LocationForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("location");
  return (
    <div className="space-y-4">
      <Segmented
        label="Location by"
        value={form.mode}
        onChange={(mode) => patch({ mode })}
        options={[
          { value: "address", label: "Address" },
          { value: "coords", label: "Coordinates" },
        ]}
      />
      {form.mode === "address" ? (
        <TextField
          label="Address or place"
          required
          value={form.address}
          onChange={(address) => patch({ address })}
          placeholder="1600 Amphitheatre Pkwy, Mountain View"
          error={errors.address}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Latitude"
            required
            inputMode="decimal"
            value={form.lat}
            onChange={(lat) => patch({ lat })}
            placeholder="33.6891"
            error={errors.lat}
          />
          <TextField
            label="Longitude"
            required
            inputMode="decimal"
            value={form.lng}
            onChange={(lng) => patch({ lng })}
            placeholder="-78.8867"
            error={errors.lng}
          />
        </div>
      )}
    </div>
  );
}

function EventForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("event");
  return (
    <div className="space-y-4">
      <TextField
        label="Event title"
        required
        value={form.title}
        onChange={(title) => patch({ title })}
        error={errors.title}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Starts"
          required
          type="datetime-local"
          value={form.start}
          onChange={(start) => patch({ start })}
          error={errors.start}
        />
        <TextField
          label="Ends"
          type="datetime-local"
          value={form.end}
          onChange={(end) => patch({ end })}
          error={errors.end}
        />
      </div>
      <TextField
        label="Location"
        value={form.location}
        onChange={(location) => patch({ location })}
      />
      <TextAreaField
        label="Description"
        rows={2}
        value={form.description}
        onChange={(description) => patch({ description })}
      />
    </div>
  );
}

function AppLinkForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("applink");
  return (
    <TextField
      label="App store or deep link"
      required
      placeholder="apps.apple.com/app/... or myapp://path"
      value={form.link}
      onChange={(link) => patch({ link })}
      hint="Store links open the listing. Custom schemes open an installed app."
      error={errors.link}
    />
  );
}

function SocialForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("social");
  const isCustom = form.platform === "custom";
  return (
    <div className="space-y-4">
      <SelectField
        label="Platform"
        value={form.platform}
        onChange={(platform) => patch({ platform })}
        options={SOCIAL_PLATFORMS.map((p) => ({ value: p.id, label: p.label }))}
      />
      <TextField
        label={isCustom ? "Profile link" : "Handle"}
        required
        value={form.handle}
        onChange={(handle) => patch({ handle })}
        placeholder={isCustom ? "https://example.com/yourprofile" : "yourhandle"}
        hint={isCustom ? undefined : "With or without the @ symbol."}
        error={errors.handle}
      />
    </div>
  );
}

function CustomForm({ errors }: { errors: Errors }) {
  const [form, patch] = useFormSlice("custom");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-300/70 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
        Advanced. This content is encoded exactly as typed, with no formatting or
        validation. Use it only if you know the payload format you need.
      </div>
      <TextAreaField
        label="Raw payload"
        required
        mono
        rows={4}
        value={form.payload}
        onChange={(payload) => patch({ payload })}
        error={errors.payload}
      />
    </div>
  );
}

const FORM_COMPONENTS: Record<QrType, (props: { errors: Errors }) => React.JSX.Element> = {
  url: UrlForm,
  text: TextForm,
  email: EmailForm,
  phone: PhoneForm,
  sms: SmsForm,
  wifi: WifiForm,
  vcard: VCardForm,
  whatsapp: WhatsAppForm,
  location: LocationForm,
  event: EventForm,
  applink: AppLinkForm,
  social: SocialForm,
  custom: CustomForm,
};

export function DestinationForm({ type, errors }: { type: QrType; errors: Errors }) {
  const Form = FORM_COMPONENTS[type];
  return <Form errors={errors} />;
}
