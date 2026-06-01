// tweaks-app.jsx — painel de Tweaks da landing Bedutti
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#B8863B", "#A87934", "#8F672D", "#D6B27A"],
  "hero": "cheia",
  "cantos": "suave"
}/*EDITMODE-END*/;

// [primary, hover, dark, light]
const PALETTES = [
  ["#B8863B", "#A87934", "#8F672D", "#D6B27A"], // Dourado (DS)
  ["#3A3A3D", "#2A2A2D", "#161618", "#8A8A8E"], // Grafite
  ["#5C6B4C", "#4E5C40", "#3A4530", "#8FA07C"], // Verde
  ["#9C5A3C", "#8A4E32", "#6E3C26", "#C98B70"]  // Terracota
];

function applyTweaks(t) {
  var root = document.documentElement;
  if (t.palette) {
    root.style.setProperty('--primary', t.palette[0]);
    root.style.setProperty('--primary-hover', t.palette[1]);
    root.style.setProperty('--primary-dark', t.palette[2]);
    root.style.setProperty('--primary-light', t.palette[3]);
  }
  root.setAttribute('data-hero', t.hero || 'cheia');
  if (t.cantos === 'reto') {
    root.style.setProperty('--card-r', '8px');
    root.style.setProperty('--hero-r', '12px');
  } else {
    root.style.setProperty('--card-r', '24px');
    root.style.setProperty('--hero-r', '32px');
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Cor de destaque" />
      <TweakColor
        label="Paleta"
        value={t.palette}
        options={PALETTES}
        onChange={(v) => setTweak('palette', v)}
      />

      <TweakSection label="Layout" />
      <TweakRadio
        label="Hero"
        value={t.hero}
        options={[
          { value: 'cheia', label: 'Imagem cheia' },
          { value: 'dividido', label: 'Dividido' }
        ]}
        onChange={(v) => setTweak('hero', v)}
      />
      <TweakRadio
        label="Cantos"
        value={t.cantos}
        options={[
          { value: 'suave', label: 'Arredondado' },
          { value: 'reto', label: 'Reto' }
        ]}
        onChange={(v) => setTweak('cantos', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
