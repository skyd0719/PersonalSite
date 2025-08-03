# Saját profil fotó feltöltése

## Hogyan töltsem fel a saját fotómat?

1. **A fotó elhelyezése:**
   - Másolja be a saját fotóját a `client/public/assets/` mappába
   - Nevezze át a fotót erre: `profile-photo.jpg`
   - A fotó formátuma lehet: `.jpg`, `.jpeg`, vagy `.png`

2. **Fotó követelmények:**
   - Ajánlott méret: 800x1000 pixel (vagy hasonló arány)
   - Professzionális megjelenés
   - Jó minőségű, éles kép
   - Személyes, üzleti stílusú fotó

3. **Ha más nevet szeretne használni:**
   - Ha a fotó neve más (pl. `kun-botond.jpg`), akkor frissítse a `client/src/components/sections/hero.tsx` fájlban a 56. sorban található útvonalat:
   ```
   src="/assets/kun-botond.jpg"
   ```

4. **Automatikus tartalék:**
   - Ha a saját fotó nem töltődik be, automatikusan egy professzionális stock fotó jelenik meg

## Jelenlegi állapot:
- ✅ Weboldal frissítve "Kun Botond" névvel
- ✅ Kapcsolati adatok frissítve az új email és telefonszám alapján
- ✅ Helyszín frissítve: "Budapest és Vácrátót, Magyarország"
- ✅ "Szakmai képesítés" módosítva "Digitalizációs elkötelezettség"-re
- ⏳ Saját fotó feltöltésre vár a `client/public/assets/profile-photo.jpg` helyre