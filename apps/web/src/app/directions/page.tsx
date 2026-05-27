import { Bike, CarFront, MapPin, Train } from "lucide-react";
import Image from "next/image";

export default function DirectionsPage() {
  return (
    <main className="container mx-auto px-4 py-10 w-full max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Anfahrt</h1>

      <section className="space-y-4 text-muted">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 inline" />
            So findest du uns
          </h2>
          <p>Gebäude SH (Hochhaus)</p>
          <p>Raum SH-403 (4. Etage)</p>
          <p>Schützenbahn 70</p>
          <p>45127 Essen</p>
          <p>Deutschland</p>
          <p className="mt-3">Das Gebäude SH liegt direkt an der Schützenbahn und ist an der braunen Fassade mit gelben Fenstern erkennbar.</p>
        </div>

        <Image src="/assets/sh_eingang.png" alt="Lageplan der Universität Essen mit Markierung des Gebäudes SH" width={771} height={339} />

        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground flex items-center">
            <Train className="w-4 h-4 mr-1.5 inline" />
            Anreise mit öffentlichen Verkehrsmitteln
          </h2>
          <p>Vom Essen Hauptbahnhof ist das Gebäude wiefolgt zu erreichen:</p>
          <ul className="list-disc list-inside mt-3">
            <li>Straßenbahnlinie <b>107</b> Richtung <b>Gelsenkirchen Hbf</b> zur Haltestelle <b>Viehofer Platz</b> (3 Min. Fahrt + 1 Min. laufen)</li>
            <li>Straßenbahnlinie <b>108</b> Richtung <b>Altenessen Bf</b> zur Haltestelle <b>Viehofer Platz</b> (3 Min. Fahrt + 1 Min. laufen)</li>
          </ul>
          <p className="mt-3">
            Die Straßenbahnen fahren tagsüber alle 5 Minuten von der U-Bahn-Station (Keller) des Essen Hbf auf Gleis 1 ab.
          </p>
          <p className="mt-3">
            Alternativ ist das Gebäude auch Fußläufig von der Haltestelle Rheinischer Platz
            mit der Straßenbahnlinie 105 sowie 106 erreichbar (4 Min. Fahrt + 3 Min. laufen),
            sowie mit den Buslinien 155 (Ausstieg Viehofer Platz) und 196 (Ausstieg Rheinischer Platz).
            Zu Fuß ist das Gebäude vom Hauptbahnhof in ca. 17 Minuten erreichbar.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground flex items-center">
            <CarFront className="w-4 h-4 mr-1.5 inline" />
            Anreise mit dem Auto
          </h2>
          <p>
            Parkmöglichkeiten sind in der Umgebung begrenzt, es wird empfohlen öffentliche
            Verkehrsmittel zu nutzen. Das Parken ist begrenzt vor dem Gebäude möglich.
            Ein öffentlicher Parkplatz befindet sich gegenüber der Stoppenberger Straße 3, 45151 Essen.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground flex items-center">
            <Bike className="w-4 h-4 mr-1.5 inline" />
            Anreise mit dem Fahrrad oder E-Scooter
          </h2>
          <p>
            Es gibt Fahrradständer direkt vor dem Gebäude SH, sowie weitere in der Umgebung.
            Das Gelände der Universität ist fahrradfreundlich und gut ausgeschildert.
          </p>
        </div>
      </section>
    </main>
  );
}
