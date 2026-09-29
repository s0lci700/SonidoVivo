"""Batch product shots for SonidoVivo via local ComfyUI (Z-Image Turbo).
Usage: python gen_productos.py [CODIGO ...]   (no args = all products)
"""
import json, os, sys, time, uuid, urllib.request, urllib.parse, pathlib

API = "http://127.0.0.1:8188"
DATA = pathlib.Path(r"C:\Users\Sol\Desktop\FULLSTACKII\SonidoVivo\frontend\src\data\productos.json")
OUT = pathlib.Path(__file__).parent / "productos_raw"
OUT.mkdir(exist_ok=True)

STYLE = ("professional e-commerce product photograph, single product centered, entire object fully visible inside the frame with generous empty margin on all sides, nothing cropped, "
         "isolated on a clean seamless light grey studio background, soft diffused studio lighting, "
         "subtle soft shadow beneath, sharp focus, high detail, realistic materials, "
         "plain unlabeled surfaces, no printed text or lettering anywhere, no logos, no brand names, no people, no hands")

# English subject per product (brand names omitted so the model doesn't invent logos)
SUBJECT = {
 "GA001": "a folk-size steel-string acoustic guitar with natural spruce top, round sound hole and brown meranti back and sides, full guitar standing upright, front view, shot from a distance so the whole guitar including the headstock is small in frame with lots of empty space above and below",
 "GA002": "a dreadnought acoustic guitar with solid natural spruce top, mahogany neck, black pickguard, full guitar upright, front view, shot from a distance so the whole guitar including the headstock is small in frame with lots of empty space above and below",
 "GA003": "a classical Spanish guitar with nylon strings, light spruce top with round sound hole and rosette, wide flat fingerboard, slotted headstock with open tuner windows, full guitar upright, front view, shot from a distance so the whole guitar including the headstock is small in frame with lots of empty space above and below",
 "GA004": "a cutaway electro-acoustic guitar with natural spruce top and a built-in preamp tuner panel on the upper side, full guitar upright, front view",
 "GA005": "a small 3/4 size children's acoustic guitar, natural wood finish, full guitar upright, front view",
 "GE001": "a stratocaster-style electric guitar, sunburst finish, maple neck, three single-coil pickups, white pickguard, full guitar upright, front view",
 "GE002": "a les paul-style single-cutaway electric guitar with flamed maple cherry sunburst top, two chrome humbuckers, full guitar upright, front view",
 "GE003": "an SG-style double-cutaway electric guitar with two sharp horns, heritage cherry red mahogany, two humbuckers, black pickguard, full guitar upright, front view, shot from a distance so the whole guitar including the headstock is small in frame with lots of empty space above and below",
 "GE004": "a telecaster-style electric guitar, butterscotch blonde body, black pickguard, maple neck, full guitar upright, front view",
 "GE005": "a semi-hollow body electric guitar with f-holes, vintage sunburst finish, two humbuckers, full guitar upright, front view, shot from a distance so the whole guitar including the headstock is small in frame with lots of empty space above and below",
 "BA001": "a four-string electric bass guitar, precision bass style, black body, white pickguard, full bass upright, front view",
 "BA002": "a jazz bass style four-string electric bass, three-tone sunburst, two single-coil pickups, full bass upright, front view",
 "BA003": "a four-string acoustic bass guitar, large hollow body with sound hole, natural wood, full instrument upright, front view",
 "BT001": "a complete five-piece acoustic drum kit with bass drum, snare, two rack toms, floor tom, hi-hat and cymbals, glossy dark blue wrap, three-quarter view",
 "BT002": "an electronic drum kit with eight black mesh pads, cymbal pads on a black metal rack and a drum module, three-quarter view",
 "BT003": "a single 14 inch snare drum with chrome shell and white coated head, on a snare stand, three-quarter view",
 "BT004": "one hi-hat: a single pair of two stacked 14 inch brass cymbals mounted on one chrome hi-hat stand with a foot pedal, only one stand, three-quarter view",
 "BT005": "a single 16 inch golden brass crash cymbal, angled view showing the lathed grooves",
 "TC001": "a portable 61-key digital keyboard in black with speakers and a small display, top three-quarter view",
 "TC002": "an 88-key digital stage piano, slim black body with weighted keys, top three-quarter view",
 "TC003": "a 49-key analog synthesizer with many knobs and sliders, black and wood side panels, top three-quarter view",
 "TC004": "a very long and wide full-size 88-key MIDI controller keyboard with a full row of eighty-eight keys, slim black body, pitch and mod wheels, top three-quarter view",
 "AM001": "a small 15 watt practice guitar amplifier combo, black tolex, silver grille cloth, control knobs on top, three-quarter view",
 "AM002": "a 40 watt guitar amplifier combo with 10 inch speaker, black tolex and black grille, chrome knobs, three-quarter view",
 "AM003": "a 100 watt bass amplifier combo cabinet, black, large speaker grille, three-quarter view",
 "AM004": "a 40 watt acoustic guitar amplifier combo with brown tan tolex and wood-colored grille, three-quarter view",
 "MI001": "a cardioid dynamic vocal microphone with silver ball mesh grille and black handle, lying at an angle",
 "MI002": "a dynamic instrument microphone with compact black grille, classic snare mic shape, lying at an angle",
 "MI003": "a large-diaphragm studio condenser microphone in a silver shock mount, front view",
 "MI004": "a USB condenser microphone on a small desktop stand, black matte finish, front view",
 "PE001": "an orange distortion guitar effects pedal with three knobs and a footswitch, top three-quarter view",
 "PE002": "a blue reverb guitar effects pedal with knobs and a footswitch, top three-quarter view",
 "PE003": "a guitar multi-effects floor processor with an LCD screen, several footswitches and an expression pedal, top three-quarter view",
 "PE004": "a chromatic tuner guitar pedal with LED display and footswitch, black, top three-quarter view",
 "PE005": "a white digital delay guitar effects pedal with knobs and a footswitch, top three-quarter view",
 "PE006": "a green overdrive guitar effects pedal with three knobs and a footswitch, top three-quarter view",
 "AC001": "a pack of electric guitar strings, a generic unbranded sealed envelope next to coiled nickel guitar strings",
 "AC002": "a pack of acoustic guitar strings, a generic unbranded sealed envelope next to coiled bronze guitar strings",
 "AC003": "a set of coiled bass guitar strings with thick round-wound nickel strings and a plain unbranded package",
 "AC004": "ten colorful guitar picks scattered in a neat fan arrangement, top view",
 "AC005": "a black aluminium spring-loaded guitar capo, three-quarter view",
 "AC006": "a small clip-on guitar headstock tuner with a round colour display on a swivel arm attached to a black spring clamp clip, three-quarter view",
 "AC007": "a coiled black guitar instrument cable with quarter-inch jack plugs, 3 metre length, top view",
 "AC008": "a coiled longer black and red tweed guitar instrument cable with gold quarter-inch jack plugs, top view",
 "AC009": "a folding black metal guitar floor stand, A-frame style with padded arms, empty, three-quarter view",
 "AC010": "a wall-mount guitar hanger with a wooden base plate and padded black yoke, empty, three-quarter view",
 "ES001": "a compact 2-in 2-out USB audio interface, red metal chassis, two combo inputs and large volume knob, three-quarter view",
 "ES002": "a pair of closed-back studio headphones, black, over-ear, three-quarter view",
 "ES003": "a pair of professional studio monitor headphones, black and silver, plush ear pads, coiled cable, three-quarter view",
 "ES004": "a single 5 inch active studio monitor speaker, black cabinet with yellow woofer cone, three-quarter view",
 "ES005": "a round nylon mesh pop filter with a gooseneck arm and clamp, three-quarter view",
}


def workflow(subject, seed):
    return {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": "z_image_turbo_bf16.safetensors", "weight_dtype": "fp8_e4m3fn"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "lumina2", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": "ae.safetensors"}},
        "4": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["1", 0], "shift": 3}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": f"{subject}. {STYLE}"}},
        "6": {"class_type": "ConditioningZeroOut", "inputs": {"conditioning": ["5", 0]}},
        "7": {"class_type": "EmptySD3LatentImage", "inputs": {"width": 1024, "height": 1024, "batch_size": 1}},
        "8": {"class_type": "KSampler", "inputs": {"model": ["4", 0], "positive": ["5", 0], "negative": ["6", 0],
              "latent_image": ["7", 0], "seed": seed, "steps": 8, "cfg": 1.0,
              "sampler_name": "res_multistep", "scheduler": "simple", "denoise": 1.0}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "SaveImage", "inputs": {"images": ["9", 0], "filename_prefix": "sonidovivo/prod"}},
    }


def post(path, body):
    req = urllib.request.Request(API + path, json.dumps(body).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


def main():
    productos = json.loads(DATA.read_text(encoding="utf-8"))
    wanted = set(sys.argv[1:])
    todo = [p for p in productos if not wanted or p["codigo"] in wanted]
    client = str(uuid.uuid4())
    for p in todo:
        cod = p["codigo"]
        dest = OUT / f"{cod}.png"
        if dest.exists() and not wanted:
            print(cod, "skip (exists)"); continue
        seed = (int.from_bytes(cod.encode(), "big") + int(os.environ.get("SEED_OFFSET", 0))) % 2**32
        t0 = time.time()
        pid = post("/prompt", {"prompt": workflow(SUBJECT[cod], seed), "client_id": client})["prompt_id"]
        while True:
            time.sleep(2)
            h = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
            if pid in h:
                break
        entry = h[pid]
        if entry["status"].get("status_str") != "success":
            print(cod, "FAILED", entry["status"]); continue
        img = entry["outputs"]["10"]["images"][0]
        q = urllib.parse.urlencode(img)
        dest.write_bytes(urllib.request.urlopen(f"{API}/view?{q}").read())
        print(f"{cod} ok {time.time()-t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
